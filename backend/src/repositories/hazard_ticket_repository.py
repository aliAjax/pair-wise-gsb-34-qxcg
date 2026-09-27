from src.seed import seed


class HazardTicketRepository:
    def find_all(self):
        return seed["hazardTicket"]

    def find_by_id(self, ticket_id):
        for row in seed["hazardTicket"]:
            if row["id"] == ticket_id:
                return row
        return None

    def find_open_by_result(self, result_id):
        for row in seed["hazardTicket"]:
            if row["result_id"] == result_id and row["rectify_status"] != "CLOSED":
                return row
        return None

    def next_id(self):
        return max([row["id"] for row in seed["hazardTicket"]] + [0]) + 1

    def insert(self, row):
        seed["hazardTicket"].append(row)
        return row

    def update(self, ticket_id, patch):
        row = self.find_by_id(ticket_id)
        if row is None:
            return None
        row.update(patch)
        return row
