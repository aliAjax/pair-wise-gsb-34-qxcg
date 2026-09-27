from src.seed import seed
class HazardTicketRepository:
    def find_all(self):
        return seed["hazardTicket"]
    def find_by_id(self, ticket_id):
        return next((row for row in seed["hazardTicket"] if row["id"] == ticket_id), None)
    def find_by_result_id(self, result_id):
        return next((row for row in seed["hazardTicket"] if row["result_id"] == result_id), None)
    def next_id(self):
        return max((row["id"] for row in seed["hazardTicket"]), default=0) + 1
    def save(self, ticket):
        for index, row in enumerate(seed["hazardTicket"]):
            if row["id"] == ticket["id"]:
                seed["hazardTicket"][index] = ticket
                return ticket
        seed["hazardTicket"].append(ticket)
        return ticket
