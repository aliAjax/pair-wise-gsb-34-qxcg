from src.seed import seed
class FireDeviceRepository:
    def find_all(self):
        return seed["fireDevice"]
    def find_by_id(self, device_id):
        return next((row for row in seed["fireDevice"] if row["id"] == device_id), None)
    def find_by_building(self, building_id):
        return [row for row in seed["fireDevice"] if row["building_id"] == building_id]
    def save(self, device):
        for index, row in enumerate(seed["fireDevice"]):
            if row["id"] == device["id"]:
                seed["fireDevice"][index] = device
                return device
        seed["fireDevice"].append(device)
        return device
