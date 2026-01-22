from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, desc, select

from ..core import get_session, oauth2_scheme
from ..models.customer import Customer
from ..schemas.customer import CustomerCreate, CustomerUpdate, CustomerRead
from ..crud.customer import (
    create_customer as create_customer_crud,
    get_customer,
    get_customers,
    update_customer as update_customer_crud,
    delete_customer as delete_customer_crud,
)
from ..schemas import ErrorResponse, SuccessResponse
from .auth import get_current_user

router = APIRouter(
    prefix="/customers",
    tags=["customers"],
    dependencies=[Depends(get_session), Depends(oauth2_scheme)],
    responses={404: {"description": "API Not found"}},
)


@router.post("/", response_model=CustomerRead)
def create_customer(
    customer: CustomerCreate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    customer_data = Customer.from_orm(customer)
    return create_customer_crud(session, customer_data)


@router.get("/{customer_id}", response_model=CustomerRead)
def read_customer(
    customer_id: int,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    customer = get_customer(session, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.get("/", response_model=List[CustomerRead])
def read_customers(
    skip: int = 0,
    limit: int = 10,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    return get_customers(session, skip=skip, limit=limit)


@router.put("/{customer_id}", response_model=CustomerRead)
def update_customer(
    customer_id: int,
    customer: CustomerUpdate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    existing_customer = get_customer(session, customer_id)
    if not existing_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer_data = customer.dict(exclude_unset=True)
    for key, value in customer_data.items():
        setattr(existing_customer, key, value)
    return update_customer_crud(session, customer_id, existing_customer)


@router.delete("/{customer_id}", response_model=bool)
def delete_customer(
    customer_id: int,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    if not delete_customer_crud(session, customer_id):
        raise HTTPException(status_code=404, detail="Customer not found")
    return True
