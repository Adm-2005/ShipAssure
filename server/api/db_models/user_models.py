# external imports
import datetime
from enum import Enum
from pydantic import Field, field_validator
from typing import Optional, List, Dict, Any
from fastapi.encoders import jsonable_encoder
from werkzeug.security import generate_password_hash, check_password_hash

# internal imports
from api.db_models.shipment_models import Mode
from api.utils.object_id import PydanticObjectId
from server.api.db_models.base_models import Serialization

# Enumerate classes to be utilized in db models
class Role(str, Enum):
    """Represents user roles."""
    shipper = 'shipper'
    carrier = 'carrier'

class Type(str, Enum):
    """Represents the options available for shipper and carrier type."""
    individual = 'individual'      
    small_scale = 'small business' # ships small quantities
    large_scale = 'large business' # ships large quantities 

# Model classes
class User(Serialization):
    """Represents an user of the application."""
    id: Optional[PydanticObjectId] = Field(default = None, alias = '_id')
    role: Role = Field(default = None)
    shipper_id: Optional[PydanticObjectId] = Field(default = None)
    carrier_id: Optional[PydanticObjectId] = Field(default = None)
    email: str = Field(default = '')
    first_name: str = Field(default = '')
    last_name: str = Field(default = '')
    country: str = Field(default = '')
    wallet_connected: bool = Field(default = False)
    wallet_address: Optional[str] = Field(default = None)
    hashed_password: Optional[str] = Field(default = None)
    created_at: datetime.datetime = Field(default_factory = datetime.datetime.now(tz = datetime.timezone.utc))

    def set_password(self, password: str) -> None:
        """
        Hashes given password before storing. Should be called when creating or updating user.

        Args
            password: original password

        """
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """
        Validates password during login.

        Args
            password: password obtained from user

        Returns
            [bool]: True if password is valid
        """
        if not self.hashed_password:
            raise ValueError('Password not yet set.')
        
        return check_password_hash(self.hashed_password, password)

    def to_json(self, include_password: bool = False) -> Dict[str, Any]:
        """
        Overrides Serialization model's to_json method 

        Args
            include_password: specifies whether to include hashed_password or not

        Returns
        """
        data = jsonable_encoder(self, custom_encoder = {PydanticObjectId: str})

        if data.get('hashed_password') and not include_password:
            data.pop('hashed_password')

        return data

class Shipper(Serialization):
    """Represents an user who uses the platform to ship cargo."""
    id: Optional[PydanticObjectId] = Field(default = None, alias = '_id')
    user_id: Optional[PydanticObjectId] = Field(default = None)
    type: Optional[Type] = Field(default = None)
    org_name: Optional[str] = Field(default = '') # applicable only when type is not individual
    address: Optional[str] = Field(default = '')
    industry: Optional[str] = Field(default = '')
    sent_shipments: Optional[List[PydanticObjectId]] = Field(default_factory = list) 

class Carrier(Serialization):
    """Represents an user who uses the platform to connect with shippers and deliver cargo."""
    id: Optional[PydanticObjectId] = Field(default = None, alias = '_id')
    user_id: Optional[PydanticObjectId] = Field(default = None)
    type: Optional[Type]
    modes: Optional[List[Mode]] = Field(default_factory = list)
    org_name: Optional[str] = Field(default = None) # applicable only when type is not individual
    address: Optional[str] = Field(default = '')
    vehicles: Optional[List[PydanticObjectId]] = Field(default_factory = list) # carriers can register their vehicles
    delivered_shipments: Optional[List[PydanticObjectId]] = Field(default = None) # _id of Shipment model
    rating: Optional[float] = Field(default = None) # Range: 1.0 - 5.0
    total_ratings: Optional[int] = Field(default = 0) # total ratings
    verified: Optional[bool] = Field(default = False) # TO-DO: Devise a proper and universal method for verification of carriers

    def update_rating(self, new_rating: float) -> None:
        """
        Updates the rating on the basis of new rating.

        Args
            new_rating: Number in the range 1.0 to 5.0

        """
        if not self.rating:
            self.total_ratings += 1
            self.rating = new_rating
        else:
            self.total_ratings += 1
            self.rating = (self.rating + new_rating) / self.total_ratings