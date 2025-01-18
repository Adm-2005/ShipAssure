# external imports
from bson import ObjectId
from typing import Dict, Any
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder

# internal imports
from api.utils.object_id import PydanticObjectId

class Serialization(BaseModel):
    """Base serialization model that is inherited by all db models."""
    def to_json(self) -> Dict[str, Any]:
        data = self.model_dump(by_alias=True)
    
        for key, value in data.items():
            if isinstance(value, (PydanticObjectId, ObjectId)):
                data[key] = str(value)
        
        return data
    
    def to_bson(self) -> Dict[str, Any]:
        data = self.model_dump(by_alias=True)
    
        for key, value in data.items():
            if isinstance(value, PydanticObjectId):
                data[key] = ObjectId(value)
    
        if data.get('_id') is None:
            data.pop('_id', None)

        return data
    
class MutableId:
    def set_id(self, id):
        self.id = PydanticObjectId(str(id)) if not isinstance(id, PydanticObjectId) else id