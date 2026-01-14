import random
import string

def generate_org_id():
    # Example: ORG8F3K2A9
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))
    return f"ORG{random_part}"
