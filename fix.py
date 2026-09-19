import os

files = [
    "D:/gwnagju-eco-tour/components/map/BusStopMarker.tsx",
    "D:/gwnagju-eco-tour/components/map/SubwayStationMarker.tsx",
    "D:/gwnagju-eco-tour/components/map/TourismMarker.tsx"
]

for f in files:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    content = content.replace("\\`data:image", "`data:image")
    content = content.replace("\\${", "${")
    content = content.replace("}\\`", "}`")
    with open(f, "w", encoding="utf-8") as file:
        file.write(content)
print("Done")

