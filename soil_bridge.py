import serial
import requests
import time

SERIAL_PORT = 'COM5'
BAUD_RATE = 9600
API_URL = 'http://127.0.0.1:8000/soil/reading'

print(f"Connecting to {SERIAL_PORT}...")
ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=2)
time.sleep(2)
print("Connected! Reading soil data...")
print("Press Ctrl+C to save the last reading and exit.\n")

current_reading = {}
last_complete_reading = None

while True:
    try:
        line = ser.readline().decode('utf-8', errors='ignore').strip()
        if not line:
            continue

        if 'Moisture:' in line:
            current_reading['moisture'] = float(line.split(':')[1].replace('%', '').strip())
        elif 'Temperature:' in line:
            current_reading['temperature'] = float(line.split(':')[1].replace('C', '').strip())
        elif 'EC:' in line:
            current_reading['ec'] = float(line.split(':')[1].replace('us/cm', '').strip())
        elif 'pH:' in line:
            current_reading['ph'] = float(line.split(':')[1].strip())
        elif 'Nitrogen:' in line:
            current_reading['nitrogen'] = float(line.split(':')[1].strip())
        elif 'Phosphorus:' in line:
            current_reading['phosphorus'] = float(line.split(':')[1].strip())
        elif 'Potassium:' in line:
            current_reading['potassium'] = float(line.split(':')[1].strip())
        elif '------' in line and len(current_reading) >= 6:
            last_complete_reading = current_reading.copy()
            print(f"  pH={last_complete_reading.get('ph')} N={last_complete_reading.get('nitrogen')} P={last_complete_reading.get('phosphorus')} K={last_complete_reading.get('potassium')} M={last_complete_reading.get('moisture')} T={last_complete_reading.get('temperature')}", end='\r')
            current_reading = {}

    except KeyboardInterrupt:
        print("\n")
        if last_complete_reading:
            print(f"Saving last reading to database...")
            print(f"  pH={last_complete_reading['ph']} N={last_complete_reading['nitrogen']} P={last_complete_reading['phosphorus']} K={last_complete_reading['potassium']} M={last_complete_reading['moisture']} T={last_complete_reading['temperature']}")
            try:
                res = requests.post(API_URL, json=last_complete_reading, timeout=5)
                if res.ok:
                    print(f"  ✓ Saved to database!")
                else:
                    print(f"  ✗ Error: {res.status_code}")
            except:
                print(f"  ✗ Backend not running")
        else:
            print("No complete reading received yet.")
        ser.close()
        print("Disconnected.")
        break
    except Exception as e:
        print(f"Error: {e}")