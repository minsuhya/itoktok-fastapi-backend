from sqlmodel import Session, select
from .models.customer import Customer
from typing import List, Optional

def create_customer(session: Session, customer: Customer) -> Customer:
    session.add(customer)
    session.commit()
    session.refresh(customer)
    return customer

def get_customer(session: Session, customer_id: int) -> Optional[Customer]:
    return session.get(Customer, customer_id)

def get_customers(session: Session, skip: int = 0, limit: int = 10) -> List[Customer]:
    statement = select(Customer).offset(skip).limit(limit)
    results = session.exec(statement)
    return results.all()

def update_customer(session: Session, customer_id: int, customer_data: Customer) -> Optional[Customer]:
    customer = session.get(Customer, customer_id)
    if customer:
        for key, value in customer_data.dict(exclude_unset=True).items():
            setattr(customer, key, value)
        session.commit()
        session.refresh(customer)
    return customer

def delete_customer(session: Session, customer_id: int) -> bool:
    customer = session.get(Customer, customer_id)
    if customer:
        session.delete(customer)
        session.commit()
        return True
    return False
