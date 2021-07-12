from pydantic import BaseModel


class TransactionSchema(BaseModel):
    recipient: str
    amount: float
