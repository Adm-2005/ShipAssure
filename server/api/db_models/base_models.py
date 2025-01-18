# external imports
from typing import Dict, Any
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder

# internal imports
from api.utils.object_id import PydanticObjectId

class Serialization(BaseModel):
    """Base serialization model that is inherited by all db models."""
    def to_json(self) -> Dict[str, Any]:
        return jsonable_encoder(self, custom_encoder = {PydanticObjectId: str})
    
    def to_bson(self) -> Dict[str, Any]:
        data = self.model_dump(by_alias = True)

        if data.get('_id') is None:
            data.pop('_id', None)

        return data