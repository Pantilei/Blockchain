**Activate the virtual environment**

```
source env/bin/activate
```

**Install all packages**

```
pip3 install -r requirements.txt
```

**Run the tests**

Make sure to activate the virtual env

```
python3 -m pytest server_python/tests
```

**Run the application and API**

```
uvicorn server_python.app:app --reload
```
