from src.seed import seed
class InspectionTaskRepository:
    def find_all(self):
        return seed["inspectionTask"]
    def find_by_id(self, task_id):
        return next((row for row in seed["inspectionTask"] if row["id"] == task_id), None)
    def save(self, task):
        for index, row in enumerate(seed["inspectionTask"]):
            if row["id"] == task["id"]:
                seed["inspectionTask"][index] = task
                return task
        seed["inspectionTask"].append(task)
        return task
