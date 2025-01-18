import pgeocode

def calculate_distance(code1: str, country1: str, code2: str, country2: str) -> float:
    """
    Calculates distance between two locations.
    
    Args
        code1: postal code of first location
        country1: first location's country
        code2: postal code of second location
        country2: secondary location's country
        
    Returns 
        [float]: distance between locations
    """
    