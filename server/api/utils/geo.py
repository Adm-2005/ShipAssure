import geopy
import pgeocode

def calculate_distance(code1: str, code2: str, country1: str = 'IN', country2: str = 'IN') -> float:
    """
    Calculates distance between two locations using postal codes and country codes.

    Args:
        code1: Postal code of the first location.
        code2: Postal code of the second location.
        country1: Country code of the first location 
        country2: Country code of the second location 

    Returns:
        float: Distance in kilometers between the two locations.
    """
    try:
        nomi1 = pgeocode.Nominatim(country1)
        nomi2 = pgeocode.Nominatim(country2)

        loc1 = nomi1.query_postal_code(code1)
        loc2 = nomi2.query_postal_code(code2)

        if loc1.empty or loc2.empty or loc1.isnull().any() or loc2.isnull().any():
            raise ValueError('Invalid postal code or country code.')

        lat1, lon1 = loc1.latitude, loc1.longitude
        lat2, lon2 = loc2.latitude, loc2.longitude

        if any(val is None for val in [lat1, lon1, lat2, lon2]):
            raise ValueError('Could not determine latitude and longitude for one of the locations.')

        from geopy.distance import geodesic
        return geodesic((lat1, lon1), (lat2, lon2)).kilometers

    except Exception as e:
        raise ValueError(f"Error calculating distance: {e}")