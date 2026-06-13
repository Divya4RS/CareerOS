from jose import jwt

SECRET_KEY = "careeros-secret-key"

def create_token(email: str):
    token = jwt.encode(
        {"email": email},
        SECRET_KEY,
        algorithm="HS256"
    )
    return token


def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"]
        )

        return payload

    except:
        return None