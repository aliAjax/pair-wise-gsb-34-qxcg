from src.seed import seed
class InspectionResultRepository:
    def find_all(self):
        return seed["inspectionResult"]
    def find_by_id(self, result_id):
        return next((row for row in seed["inspectionResult"] if row["id"] == result_id), None)
    def find_by_task(self, task_id):
        return [row for row in seed["inspectionResult"] if row["task_id"] == task_id]
    def find_by_task_device_item(self, task_id, device_id, item_code):
        return next((row for row in seed["inspectionResult"]
                     if row["task_id"] == task_id and row["device_id"] == device_id and row["item_code"] == item_code), None)
    def next_id(self):
        return max((row["id"] for row in seed["inspectionResult"]), default=0) + 1
    def save(self, result):
        for index, row in enumerate(seed["inspectionResult"]):
            if row["id"] == result["id"]:
                seed["inspectionResult"][index] = result
                return result
        seed["inspectionResult"].append(result)
        return result
