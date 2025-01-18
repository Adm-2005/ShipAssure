# external imports
import datetime
from typing import Optional
from pydantic import field_validator, Field

# internal imports
from api.utils.object_id import PydanticObjectId
from api.db_models.base_models import Serialization

class Vehicle(Serialization):
    """Represents vehicle used for shipment delivery."""
    id: Optional[PydanticObjectId] = Field(default = None, alias = '_id')
    carrier_id: Optional[PydanticObjectId] = Field(default = None)
    age: Optional[int] = Field(default = None)
    registration_number: str
    is_rented: bool = Field(default = False)
    owner_name: Optional[str] = Field(default = None) 
    rent_duration: Optional[int] = Field(default = 0) # In months, 0 for non-rented vehicles.
    additional_info: Optional[str] = Field(default = '')
    updated_at: Optional[datetime.datetime]
    
    @field_validator('age')
    def validate_age(cls, v):
        if v <= 0:
            raise ValueError('Age must be greater than 0.')
        return v