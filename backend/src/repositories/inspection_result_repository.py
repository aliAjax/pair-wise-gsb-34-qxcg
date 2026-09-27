from src.seed import seed


class InspectionResultRepository:
    def find_all(self):
        return seed["inspectionResult"]

    def find_by_id(self, result_id):
        for row in seed["inspectionResult"]:
            if row["id"] == result_id:
                return row
        return None

    def find_by_task(self, task_id):
        return [row for row in seed["inspectionResult"] if row["task_id"] == task_id]

    def find_one(self, task_id, device_id, item_code):
        for row in seed["inspectionResult"]:
            if row["task_id"] == task_id and row["device_id"] == device_id and row["item_code"] == item_code:
                return row
        return None

    def next_id(self):
        return max([row["id"] for row in seed["inspectionResult"]] + [0]) + 1

    def insert(self, row):
        seed["inspectionResult"].append(row)
        return row

    def update(self, result_id, patch):
        row = self.find_by_id(result_id)
        if row is None:
            return None
        row.update(patch)
        return row
