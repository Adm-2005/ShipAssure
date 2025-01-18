# external imports
import datetime
from enum import Enum
from pydantic import Field, field_validator
from typing import Optional, List, Dict, Any, Tuple

# internal imports
from api.utils.object_id import PydanticObjectId
from api.db_models.base_models import Serialization, MutableId

# Enumerate classes to be used alongside db models
class ImpedimentType(str, Enum):
    """Represents types of impediments"""
    weather = 'weather'
    fuel = 'fuel'
    accident = 'accident'
    repair = 'repair'
    cargo = 'cargo'
    other = 'other'

class Mode(str, Enum):
    """Represents options for transportation modes"""
    air = 'air'
    water = 'water'
    railway = 'railway'
    road = 'road'

class Status(str, Enum):
    """Represents a shipment's lifecycle"""
    waiting = 'waiting' # newly created shipment waiting for carrier bids
    active = 'active' 
    delayed = 'delayed'
    delivered = 'delivered'

# Model Classes
class Impediment(Serialization, MutableId):
    """Represents an issue that occurred while delivering the shipment"""
    id: Optional[PydanticObjectId] = Field(default = None, alias = '_id')
    type: ImpedimentType = Field(default = None)
    delay_caused: datetime.timedelta = Field(default = None)
    resolved: bool = Field(default = False)
    additional_info: Optional[str] = Field(default = None)
    occurred_at: datetime.datetime = Field(default_factory = lambda:datetime.datetime.now(tz = datetime.timezone.utc))
    resolved_at: Optional[datetime.datetime] = Field(default = None)
    updated_at: Optional[datetime.datetime] = Field(default = None)

    def resolve(self) -> None:
        self.resolved = True
        self.resolved_at = datetime.datetime.now(tz = datetime.timezone.utc)

class Location(Serialization, MutableId):
    """Represents current or previous location of the shipment"""
    id: Optional[PydanticObjectId] = Field(default = None, alias = '_id')
    location: Tuple[float, float] = Field(default_factory = tuple)  # (latitude, longitude)
    timestamp: datetime.datetime = Field(default_factory = lambda: datetime.datetime.now(tz = datetime.timezone.utc))

class Route(Serialization, MutableId):
    """Represents predicted and actual routes"""
    id: Optional[PydanticObjectId] = Field(default = None, alias = '_id')
    path: List[Tuple[float, float]] = Field(default_factory = list)  # List of co-ordinates (latitude, longitude)
    distance: Optional[float] = Field(default = None)
    estimated_duration: Optional[datetime.timedelta] = Field(default = None)

class Bid(Serialization, MutableId):
    """Represents bid on a shipment"""
    id: Optional[PydanticObjectId] = Field(default = None, alias = '_id') 
    carrier_id: Optional[PydanticObjectId] = Field(default = None)
    shipment_id: Optional[PydanticObjectId] = Field(default = None)
    proposed_price: float = Field(default = None)
    proposed_vehicle: Optional[PydanticObjectId] = Field(default = None) # id of object of Vehicle model
    proposed_delivery_date: Optional[datetime.datetime] = Field(default = None)
    accepted: bool = Field(default = False)
    additional_notes: Optional[str] = Field(default = '')
    created_at: datetime.datetime = Field(default_factory = lambda: datetime.datetime.now(tz = datetime.timezone.utc))
    accepted_at: Optional[datetime.datetime] = Field(default = None)

    def accept_bid(self):
        """Marks a bid as accepted."""
        self.accepted = True
        self.accepted_at = datetime.datetime.now(tz = datetime.timezone.utc)

class Shipment(Serialization, MutableId):
    """Represents a shipment"""
    id: Optional[PydanticObjectId] = Field(default = None, alias = '_id')
    shipper_id: Optional[PydanticObjectId] = Field(default = None)
    carrier_id: Optional[PydanticObjectId] = Field(default = None)
    status: Status = Field(default = None)
    modes: List[Mode] = Field(default_factory = list)
    pickup_point: Optional[str] = Field(default = None)
    origin: Dict[str, Any] = Field(default_factory = dict) # includes postal code, city and country
    destination: Dict[str, Any] = Field(default_factory = dict) # includes postal code, city and country
    distance: float = Field(default = None)
    cargo_load: float = Field(default = None)
    cargo_type: str = Field(default = None)
    price: Optional[float] = Field(default = None)
    current_location: Optional[PydanticObjectId] = Field(default = None) # id of an object of 'Location' model
    vehicle: Optional[PydanticObjectId] = Field(default = None) # id of an object of 'Vehicle' model
    bids: Optional[List[PydanticObjectId]] = Field(default_factory = list) # list of ids of objects of 'Bid' model
    impediments: Optional[List[PydanticObjectId]] = Field(default_factory = list) # list of ids of objects of 'Impediment' model
    predicted_route: Optional[PydanticObjectId] = Field(default = None) # id of an object of 'Route' model
    route_taken: Optional[PydanticObjectId] = Field(default = None) # id of an object of 'Route' model
    shipped_at: Optional[datetime.datetime] = Field(default = None) # datetime at which the shipment delivery starts
    estimated_delivery_date: datetime.datetime = Field(default = None)
    delivered_at: Optional[datetime.datetime] = Field(default = None) # only when status is delivered
    created_at: datetime.datetime = Field(default_factory = lambda: datetime.datetime.now(tz = datetime.timezone.utc))
    updated_at: Optional[datetime.datetime]

    def deliver(self) -> None:
        self.delivered = True
        self.delivered_at = datetime.datetime.now(tz = datetime.timezone.utc).date

    @field_validator('estimated_delivery_date')
    def validate_estimated_date(cls, v, values):
        if 'shipped_at' in values and v < values['shipped_at']:
            raise ValueError('Estimated date must be greater than or equal to shipping date.')
        return v

    @field_validator('price', 'cargo_load', 'distance')
    def positive_values(cls, v):
        if v <= 0:
            raise ValueError(f'Must be a positive value.')
        return v