import pytest
import os

@pytest.fixture
def get_model_name():
    
    def _get_model_name(api_name: str):
        env_var_name = f"{api_name.upper()}_MODEL_NAME"
        model_name = os.environ.get(env_var_name)
        if not model_name:
            pytest.fail(f"A variável de ambiente '{env_var_name}' não está definida.")
        return model_name
        
    return _get_model_name