from datetime import timedelta, date
from os import stat
from time import sleep
import enum
import random, string
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
# https://flask-sqlalchemy.palletsprojects.com/en/2.x/binds/

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity, get_jwt
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
# https://flask-jwt-extended.readthedocs.io/en/stable/basic_usage/

app = Flask(__name__, static_url_path='', static_folder='client')

app.config["JWT_SECRET_KEY"] = "esami-applicazioni-web-2231"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:e27b149y@localhost:5432/appdata'
app.config['SQLALCHEMY_BINDS'] = {
    'users': 'postgresql://postgres:e27b149y@localhost:5432/usermanagement'
}
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
jwt = JWTManager(app)

from flask.json import JSONEncoder
class CustomJSONEncoder(JSONEncoder):
  "Add support for serializing dates"

  def default(self, value):
    if type(value) == date:
        return value.strftime('%Y-%m-%d')
    else:
        return super().default(value)

app.json_encoder = CustomJSONEncoder

class UserType(enum.Enum):
    customer = 0
    agent = 1
    manager = 2

    @classmethod
    def asFullDict(self):
        return { 
            'is_manager': self == UserType.manager,
            'is_agent': self == UserType.agent,
            'is_customer': self == UserType.customer
        }
class User(db.Model):
    __bind_key__ = 'users'
    # id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, primary_key=True, nullable=False)
    password = db.Column(db.Text, primary_key=False, nullable=False)
    utype = db.Column(db.Enum(UserType), primary_key=False, nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username
    
    @staticmethod
    def verify(username, password):
        return User.query.filter_by(username=username, password=password).first()
    
    @staticmethod
    def get(username):
        return User.query.filter_by(username=username).first()

class Order(db.Model):
    ord_num = db.Column(db.Integer, primary_key=True, nullable=False)
    ord_amount = db.Column(db.Integer, nullable=False)
    advance_amount = db.Column(db.Integer, nullable=False)
    ord_date = db.Column(db.Date, nullable=False)
    cust_code = db.Column(db.Text, db.ForeignKey('customer.cust_code'), nullable=False)
    agent_code = db.Column(db.Text, db.ForeignKey('agent.agent_code'), nullable=False)
    order_description = db.Column(db.Text, nullable=True)

    agent = db.relationship('Agent')
    customer = db.relationship('Customer')

    @staticmethod
    def get(ord_num):
        return Order.query.filter_by(ord_num=ord_num).first()
    
    @staticmethod
    def getAllByAgent(agent_code):
        return Order.query.filter_by(agent_code=agent_code)
    
    @staticmethod
    def getAllByCustomer(cust_code):
        return Order.query.filter_by(cust_code=cust_code)
    
    @staticmethod
    def getAll():
        return Order.query.all()
    
    def toDict(self):
        # print(self.agent.agent_name)
        dict = { c.name: getattr(self, c.name) for c in self.__table__.columns }
        dict['agent_name'] = self.agent.agent_name
        dict['cust_name'] = self.customer.cust_name
        return dict
        # return {
        #     'ord_num': self.ord_num,
        #     'ord_amount': self.ord_amount,
        #     'advance_amount': self.advance_amount,
        #     'ord_date': self.ord_date,
        #     'cust_code': self.cust_code,
        #     'agent_code': self.agent_code,
        #     'order_description': self.order_description
        # }


class Agent(db.Model):
    agent_code = db.Column(db.Text, primary_key=True, nullable=False)
    agent_name = db.Column(db.Text, nullable=False)
    working_area = db.Column(db.Text, nullable=False)
    commission = db.Column(db.Float, nullable=False)
    phone_no = db.Column(db.Text, nullable=False)
    country = db.Column(db.Text, nullable=False)

    @staticmethod
    def get(agent_code):
        return Agent.query.filter_by(agent_code=agent_code).first()

    @staticmethod
    def getAll():
        return Agent.query.all()
    
    def toDict(self):
        return { c.name: getattr(self, c.name) for c in self.__table__.columns }
    
    def toSmallDict(self):
        return {
            'agent_code': self.agent_code,
            'agent_name': self.agent_name,
            'phone_no': self.phone_no
        }


class Customer(db.Model):
    cust_code = db.Column(db.Text, primary_key=True, nullable=False)
    cust_name = db.Column(db.Text, nullable=False)
    cust_city = db.Column(db.Text, nullable=False)
    working_area = db.Column(db.Text, nullable=False)
    cust_country = db.Column(db.Text, nullable=False)
    grade = db.Column(db.Integer, nullable=False) # TODO ENUM
    opening_amt = db.Column(db.Float, nullable=False)
    receive_amt = db.Column(db.Float, nullable=False)
    payment_amt = db.Column(db.Float, nullable=False)
    outstanding_amt = db.Column(db.Float, nullable=False)
    phone_no = db.Column(db.Text, nullable=False)
    agent_code = db.Column(db.Text, db.ForeignKey('agent.agent_code'), nullable=False)

    agent = db.relationship('Agent')

    @staticmethod
    def get(cust_code):
        return Customer.query.filter_by(cust_code=cust_code).first()

    @staticmethod
    def getAll():
        return Customer.query.all()
    
    @staticmethod
    def getAllByAgent(agent_code):
        return Customer.query.filter_by(agent_code=agent_code)
    
    def toDict(self):
        dict = { c.name: getattr(self, c.name) for c in self.__table__.columns }
        dict['agent_name'] = self.agent.agent_name
        return dict
    
    def toSmallDict(self):
        return {
            'cust_code': self.cust_code,
            'cust_name': self.cust_name,
            'phone_no': self.phone_no
        }

db.create_all()

INIT_USERS = False
INIT_ORDERS = len(Order.getAll()) == 0
INIT_AGENTS = len(Agent.getAll()) == 0
INIT_CUSTOMERS = len(Customer.getAll()) == 0

if INIT_USERS:
    users = [
        ('dirigente', UserType.manager),
        ('A002', UserType.agent),
        ('C00022', UserType.customer)
    ]
    for usr in users:
        u = User(username=usr[0], password='test', utype=usr[1])
        db.session.add(u)
    db.session.commit()

if INIT_ORDERS:
    ordini_test = [
        { "ord_num": "200100", "ord_amount": 1000, "advance_amount": 600, "ord_date": "2008-08-01", "cust_code": "C00013", "agent_code": "A003", "order_description": "SOD" },
        { "ord_num": "200110", "ord_amount": 3000, "advance_amount": 500, "ord_date": "2008-04-15", "cust_code": "C00019", "agent_code": "A010", "order_description": "SOD" },
        { "ord_num": "200107", "ord_amount": 4500, "advance_amount": 900, "ord_date": "2008-08-30", "cust_code": "C00007", "agent_code": "A010", "order_description": "SOD" },
        { "ord_num": "200112", "ord_amount": 2000, "advance_amount": 400, "ord_date": "2008-05-30", "cust_code": "C00016", "agent_code": "A007", "order_description": "SOD" },
        { "ord_num": "200113", "ord_amount": 4000, "advance_amount": 600, "ord_date": "2008-06-10", "cust_code": "C00022", "agent_code": "A002", "order_description": "SOD" },
        { "ord_num": "200102", "ord_amount": 2000, "advance_amount": 300, "ord_date": "2008-05-25", "cust_code": "C00012", "agent_code": "A012", "order_description": "SOD" },
        { "ord_num": "200114", "ord_amount": 3500, "advance_amount": 2000, "ord_date": "2008-08-15", "cust_code": "C00002", "agent_code": "A008", "order_description": "SOD" },
        { "ord_num": "200122", "ord_amount": 2500, "advance_amount": 400, "ord_date": "2008-09-16", "cust_code": "C00003", "agent_code": "A004", "order_description": "SOD" },
        { "ord_num": "200118", "ord_amount": 500, "advance_amount": 100, "ord_date": "2008-07-20", "cust_code": "C00023", "agent_code": "A006", "order_description": "SOD" },
        { "ord_num": "200119", "ord_amount": 4000, "advance_amount": 700, "ord_date": "2008-09-16", "cust_code": "C00007", "agent_code": "A010", "order_description": "SOD" },
        { "ord_num": "200121", "ord_amount": 1500, "advance_amount": 600, "ord_date": "2008-09-23", "cust_code": "C00008", "agent_code": "A004", "order_description": "SOD" },
        { "ord_num": "200130", "ord_amount": 2500, "advance_amount": 400, "ord_date": "2008-07-30", "cust_code": "C00025", "agent_code": "A011", "order_description": "SOD" },
        { "ord_num": "200134", "ord_amount": 4200, "advance_amount": 1800, "ord_date": "2008-09-25", "cust_code": "C00004", "agent_code": "A005", "order_description": "SOD" },
        { "ord_num": "200108", "ord_amount": 4000, "advance_amount": 600, "ord_date": "2008-02-15", "cust_code": "C00008", "agent_code": "A004", "order_description": "SOD" },
        { "ord_num": "200103", "ord_amount": 1500, "advance_amount": 700, "ord_date": "2008-05-15", "cust_code": "C00021", "agent_code": "A005", "order_description": "SOD" },
        { "ord_num": "200105", "ord_amount": 2500, "advance_amount": 500, "ord_date": "2008-07-18", "cust_code": "C00025", "agent_code": "A011", "order_description": "SOD" },
        { "ord_num": "200109", "ord_amount": 3500, "advance_amount": 800, "ord_date": "2008-07-30", "cust_code": "C00011", "agent_code": "A010", "order_description": "SOD" },
        { "ord_num": "200101", "ord_amount": 3000, "advance_amount": 1000, "ord_date": "2008-07-15", "cust_code": "C00001", "agent_code": "A008", "order_description": "SOD" },
        { "ord_num": "200111", "ord_amount": 1000, "advance_amount": 300, "ord_date": "2008-07-10", "cust_code": "C00020", "agent_code": "A008", "order_description": "SOD" },
        { "ord_num": "200104", "ord_amount": 1500, "advance_amount": 500, "ord_date": "2008-03-13", "cust_code": "C00006", "agent_code": "A004", "order_description": "SOD" },
        { "ord_num": "200106", "ord_amount": 2500, "advance_amount": 700, "ord_date": "2008-04-20", "cust_code": "C00005", "agent_code": "A002", "order_description": "SOD" },
        { "ord_num": "200125", "ord_amount": 2000, "advance_amount": 600, "ord_date": "2008-10-10", "cust_code": "C00018", "agent_code": "A005", "order_description": "SOD" },
        { "ord_num": "200117", "ord_amount": 800, "advance_amount": 200, "ord_date": "2008-10-20", "cust_code": "C00014", "agent_code": "A001", "order_description": "SOD" },
        { "ord_num": "200123", "ord_amount": 500, "advance_amount": 100, "ord_date": "2008-09-16", "cust_code": "C00022", "agent_code": "A002", "order_description": "SOD" },
        { "ord_num": "200120", "ord_amount": 500, "advance_amount": 100, "ord_date": "2008-07-20", "cust_code": "C00009", "agent_code": "A002", "order_description": "SOD" },
        { "ord_num": "200116", "ord_amount": 500, "advance_amount": 100, "ord_date": "2008-07-13", "cust_code": "C00010", "agent_code": "A009", "order_description": "SOD" },
        { "ord_num": "200124", "ord_amount": 500, "advance_amount": 100, "ord_date": "2008-06-20", "cust_code": "C00017", "agent_code": "A007", "order_description": "SOD" },
        { "ord_num": "200126", "ord_amount": 500, "advance_amount": 100, "ord_date": "2008-06-24", "cust_code": "C00022", "agent_code": "A002", "order_description": "SOD" },
        { "ord_num": "200129", "ord_amount": 2500, "advance_amount": 500, "ord_date": "2008-07-20", "cust_code": "C00024", "agent_code": "A006", "order_description": "SOD" },
        { "ord_num": "200127", "ord_amount": 2500, "advance_amount": 400, "ord_date": "2008-07-20", "cust_code": "C00015", "agent_code": "A003", "order_description": "SOD" },
        { "ord_num": "200128", "ord_amount": 3500, "advance_amount": 1500, "ord_date": "2008-07-20", "cust_code": "C00009", "agent_code": "A002", "order_description": "SOD" },
        { "ord_num": "200135", "ord_amount": 2000, "advance_amount": 800, "ord_date": "2008-09-16", "cust_code": "C00007", "agent_code": "A010", "order_description": "SOD" },
        { "ord_num": "200131", "ord_amount": 900, "advance_amount": 150, "ord_date": "2008-08-26", "cust_code": "C00012", "agent_code": "A012", "order_description": "SOD" },
        { "ord_num": "200133", "ord_amount": 1200, "advance_amount": 400, "ord_date": "2008-06-29", "cust_code": "C00009", "agent_code": "A002", "order_description": "SOD" }
    ]
    for ord in ordini_test:
        o = Order(
            ord_num=ord['ord_num'],
            ord_amount=ord['ord_amount'],
            advance_amount=ord['advance_amount'],
            ord_date=ord['ord_date'],
            cust_code=ord['cust_code'],
            agent_code=ord['agent_code'],
            order_description=ord['order_description']
        )
        db.session.add(o)
    db.session.commit()

if INIT_AGENTS:
    agenti_test = [
        { "agent_code": "A007", "agent_name": "Ramasundar", "working_area": "Bangalore", "commission": 0.15, "phone_no": "077-25814763", "country": 'India' },
        { "agent_code": "A003", "agent_name": "Alex", "working_area": "London", "commission": 0.13, "phone_no": "075-12458969", "country": 'UK' },
        { "agent_code": "A008", "agent_name": "Alford", "working_area": "New York", "commission": 0.12, "phone_no": "044-25874365", "country": 'USA' },
        { "agent_code": "A011", "agent_name": "Ravi Kumar", "working_area": "Bangalore", "commission": 0.15, "phone_no": "077-45625874", "country": '' },
        { "agent_code": "A010", "agent_name": "Santakumar", "working_area": "Chennai", "commission": 0.14, "phone_no": "007-22388644", "country": '' },
        { "agent_code": "A012", "agent_name": "Lucida", "working_area": "San Jose", "commission": 0.12, "phone_no": "044-52981425", "country": '' },
        { "agent_code": "A005", "agent_name": "Anderson", "working_area": "Brisban", "commission": 0.13, "phone_no": "045-21447739", "country": '' },
        { "agent_code": "A001", "agent_name": "Subbarao", "working_area": "Bangalore", "commission": 0.14, "phone_no": "077-12346674", "country": '' },
        { "agent_code": "A002", "agent_name": "Mukesh", "working_area": "Mumbai", "commission": 0.11, "phone_no": "029-12358964", "country": '' },
        { "agent_code": "A006", "agent_name": "McDen", "working_area": "London", "commission": 0.15, "phone_no": "078-22255588", "country": '' },
        { "agent_code": "A004", "agent_name": "Ivan", "working_area": "Torento", "commission": 0.15, "phone_no": "008-22544166", "country": '' },
        { "agent_code": "A009", "agent_name": "Benjamin", "working_area": "Hampshair", "commission": 0.11, "phone_no": "008-22536178", "country": '' }
        ]
    for age in agenti_test:
        a = Agent(
            agent_code=age['agent_code'],
            agent_name=age['agent_name'],
            working_area=age['working_area'],
            commission=age['commission'],
            phone_no=age['phone_no'],
            country=age['country']
        )
        db.session.add(a)
    db.session.commit()

if INIT_CUSTOMERS:
    clienti_test = [
        { "cust_code": "C00013", "cust_name": "Holmes", "cust_city": "London", "working_area": "London", "cust_country": "UK", "grade": 2, "opening_amt": 6000, "receive_amt": 5000, "payment_amt": 7000, "outstanding_amt": 4000, "phone_no": "BBBBBBB", "agent_code": "A003" },
        { "cust_code": "C00001", "cust_name": "Micheal", "cust_city": "NewYork", "working_area": "NewYork", "cust_country": "USA", "grade": 2, "opening_amt": 3000, "receive_amt": 5000, "payment_amt": 2000, "outstanding_amt": 6000, "phone_no": "CCCCCCC", "agent_code": "A008" },
        { "cust_code": "C00020", "cust_name": "Albert", "cust_city": "NewYork", "working_area": "NewYork", "cust_country": "USA", "grade": 3, "opening_amt": 5000, "receive_amt": 7000, "payment_amt": 6000, "outstanding_amt": 6000, "phone_no": "BBBBSBB", "agent_code": "A008" },
        { "cust_code": "C00025", "cust_name": "Ravindran", "cust_city": "Bangalore", "working_area": "Bangalore", "cust_country": "India", "grade": 2, "opening_amt": 5000, "receive_amt": 7000, "payment_amt": 4000, "outstanding_amt": 8000, "phone_no": "AVAVAVA", "agent_code": "A011" },
        { "cust_code": "C00024", "cust_name": "Cook", "cust_city": "London", "working_area": "London", "cust_country": "UK", "grade": 2, "opening_amt": 4000, "receive_amt": 9000, "payment_amt": 7000, "outstanding_amt": 6000, "phone_no": "FSDDSDF", "agent_code": "A006" },
        { "cust_code": "C00015", "cust_name": "Stuart", "cust_city": "London", "working_area": "London", "cust_country": "UK", "grade": 1, "opening_amt": 6000, "receive_amt": 8000, "payment_amt": 3000, "outstanding_amt": 1100, "phone_no": "GFSGERS", "agent_code": "A003" },
        { "cust_code": "C00002", "cust_name": "Bolt", "cust_city": "NewYork", "working_area": "NewYork", "cust_country": "USA", "grade": 3, "opening_amt": 5000, "receive_amt": 7000, "payment_amt": 9000, "outstanding_amt": 3000, "phone_no": "DDNRDRH", "agent_code": "A008" },
        { "cust_code": "C00018", "cust_name": "Fleming", "cust_city": "Brisban", "working_area": "Brisban", "cust_country": "Australia", "grade": 2, "opening_amt": 7000, "receive_amt": 7000, "payment_amt": 9000, "outstanding_amt": 5000, "phone_no": "NHBGVFC", "agent_code": "A005" },
        { "cust_code": "C00021", "cust_name": "Jacks", "cust_city": "Brisban", "working_area": "Brisban", "cust_country": "Australia", "grade": 1, "opening_amt": 7000, "receive_amt": 7000, "payment_amt": 7000, "outstanding_amt": 7000, "phone_no": "WERTGDF", "agent_code": "A005" },
        { "cust_code": "C00019", "cust_name": "Yearannaidu", "cust_city": "Chennai", "working_area": "Chennai", "cust_country": "India", "grade": 1, "opening_amt": 8000, "receive_amt": 7000, "payment_amt": 7000, "outstanding_amt": 8000, "phone_no": "ZZZZBFV", "agent_code": "A010" },
        { "cust_code": "C00005", "cust_name": "Sasikant", "cust_city": "Mumbai", "working_area": "Mumbai", "cust_country": "India", "grade": 1, "opening_amt": 7000, "receive_amt": 11000, "payment_amt": 7000, "outstanding_amt": 1100, "phone_no": "147-25896312", "agent_code": "A002" },
        { "cust_code": "C00007", "cust_name": "Ramanathan", "cust_city": "Chennai", "working_area": "Chennai", "cust_country": "India", "grade": 1, "opening_amt": 7000, "receive_amt": 11000, "payment_amt": 9000, "outstanding_amt": 9000, "phone_no": "GHRDWSD", "agent_code": "A010" },
        { "cust_code": "C00022", "cust_name": "Avinash", "cust_city": "Mumbai", "working_area": "Mumbai", "cust_country": "India", "grade": 2, "opening_amt": 7000, "receive_amt": 11000, "payment_amt": 9000, "outstanding_amt": 9000, "phone_no": "113-12345678", "agent_code": "A002" },
        { "cust_code": "C00004", "cust_name": "Winston", "cust_city": "Brisban", "working_area": "Brisban", "cust_country": "Australia", "grade": 1, "opening_amt": 5000, "receive_amt": 8000, "payment_amt": 7000, "outstanding_amt": 6000, "phone_no": "AAAAAAA", "agent_code": "A005" },
        { "cust_code": "C00023", "cust_name": "Karl", "cust_city": "London", "working_area": "London", "cust_country": "UK", "grade": 0, "opening_amt": 4000, "receive_amt": 6000, "payment_amt": 7000, "outstanding_amt": 3000, "phone_no": "AAAABAA", "agent_code": "A006" },
        { "cust_code": "C00006", "cust_name": "Shilton", "cust_city": "Torento", "working_area": "Torento", "cust_country": "Canada", "grade": 1, "opening_amt": 10000, "receive_amt": 7000, "payment_amt": 6000, "outstanding_amt": 1100, "phone_no": "DDDDDDD", "agent_code": "A004" },
        { "cust_code": "C00010", "cust_name": "Charles", "cust_city": "Hampshair", "working_area": "Hampshair", "cust_country": "UK", "grade": 3, "opening_amt": 6000, "receive_amt": 4000, "payment_amt": 5000, "outstanding_amt": 5000, "phone_no": "MMMMMMM", "agent_code": "A009" },
        { "cust_code": "C00017", "cust_name": "Srinivas", "cust_city": "Bangalore", "working_area": "Bangalore", "cust_country": "India", "grade": 2, "opening_amt": 8000, "receive_amt": 4000, "payment_amt": 3000, "outstanding_amt": 9000, "phone_no": "AAAAAAB", "agent_code": "A007" },
        { "cust_code": "C00012", "cust_name": "Steven", "cust_city": "San Jose", "working_area": "San Jose", "cust_country": "USA", "grade": 1, "opening_amt": 5000, "receive_amt": 7000, "payment_amt": 9000, "outstanding_amt": 3000, "phone_no": "KRFYGJK", "agent_code": "A012" },
        { "cust_code": "C00008", "cust_name": "Karolina", "cust_city": "Torento", "working_area": "Torento", "cust_country": "Canada", "grade": 1, "opening_amt": 7000, "receive_amt": 7000, "payment_amt": 9000, "outstanding_amt": 5000, "phone_no": "HJKORED", "agent_code": "A004" },
        { "cust_code": "C00003", "cust_name": "Martin", "cust_city": "Torento", "working_area": "Torento", "cust_country": "Canada", "grade": 2, "opening_amt": 8000, "receive_amt": 7000, "payment_amt": 7000, "outstanding_amt": 8000, "phone_no": "MJYURFD", "agent_code": "A004" },
        { "cust_code": "C00009", "cust_name": "Ramesh", "cust_city": "Mumbai", "working_area": "Mumbai", "cust_country": "India", "grade": 3, "opening_amt": 8000, "receive_amt": 7000, "payment_amt": 3000, "outstanding_amt": 12000, "phone_no": "Phone No", "agent_code": "A002" },
        { "cust_code": "C00014", "cust_name": "Rangarappa", "cust_city": "Bangalore", "working_area": "Bangalore", "cust_country": "India", "grade": 2, "opening_amt": 8000, "receive_amt": 11000, "payment_amt": 7000, "outstanding_amt": 12000, "phone_no": "AAAATGF", "agent_code": "A001" },
        { "cust_code": "C00016", "cust_name": "Venkatpati", "cust_city": "Bangalore", "working_area": "Bangalore", "cust_country": "India", "grade": 2, "opening_amt": 8000, "receive_amt": 11000, "payment_amt": 7000, "outstanding_amt": 12000, "phone_no": "JRTVFDD", "agent_code": "A007" },
        { "cust_code": "C00011", "cust_name": "Sundariya", "cust_city": "Chennai", "working_area": "Chennai", "cust_country": "India", "grade": 3, "opening_amt": 7000, "receive_amt": 11000, "payment_amt": 7000, "outstanding_amt": 11000, "phone_no": "PPHGRTS", "agent_code": "A010" }
        ]
    for cli in clienti_test:
        c = Customer(
            cust_code=cli['cust_code'],
            cust_name=cli['cust_name'],
            cust_city=cli['cust_city'],
            working_area=cli['working_area'],
            cust_country=cli['cust_country'],
            grade=cli['grade'],
            opening_amt=cli['opening_amt'],
            receive_amt=cli['receive_amt'],
            payment_amt=cli['payment_amt'],
            outstanding_amt=cli['outstanding_amt'],
            phone_no=cli['phone_no'],
            agent_code=cli['agent_code']
        )
        db.session.add(c)
    db.session.commit()



##################
#     ACCESS     #
##################

@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    # user = next(filter(lambda u: u[0] == username, users), None)
    user = User.verify(username, password)
    if not user:
        return jsonify({"msg": "Credenziali non riconosciute"}), 401

    access_token = create_access_token(
        identity=username,
        additional_claims={ 
            'is_manager': user.utype == UserType.manager,
            'is_agent': user.utype == UserType.agent,
            'is_customer': user.utype == UserType.customer
        })
    return jsonify(access_token=access_token)

@app.route("/refreshtoken", methods=["POST"])
@jwt_required(refresh=False)
def refresh():
    identity = get_jwt_identity()
    user = User.get(identity)
    if not user:
        return jsonify({"msg": "Credenziali non riconosciute"}), 401
    access_token = create_access_token(identity=identity, additional_claims=user.utype.asFullDict())
    return jsonify(access_token=access_token)




##################
#     ORDERS     #
##################

@app.route("/orders", methods=["GET"])
@jwt_required()
def orders():
    # sleep(2)
    identity = get_jwt_identity()
    current_jwt = get_jwt()
    orders_lst = []
    if current_jwt['is_customer']:
        orders_lst = Order.getAllByCustomer(identity)
    elif current_jwt['is_agent']:
        orders_lst = Order.getAllByAgent(identity)
    else:
        orders_lst = Order.getAll()
    return jsonify(list(map(lambda order: order.toDict(), orders_lst))), 200

@app.route("/order/<id>", methods=["DELETE"])
@jwt_required()
def deleteOrders (id):
    identity = get_jwt_identity()
    # current_jwt = get_jwt()
    order = Order.get(id)
    if order and identity == order.agent_code: # current_jwt['is_agent'] superfluo: mi interessa se è un suo ordine, che sia un altro agente o un altro tipo di utente è indifferente
        order.delete()
        db.commit()
        return '', 200
    else:
        return jsonify({"msg": "Accesso negato"}), 403

@app.route("/order/<id>", methods=["PUT"])
@jwt_required()
def updateOrder(id):
    identity = get_jwt_identity()
    current_jwt = get_jwt()
    if not (current_jwt['is_agent'] or current_jwt['is_manager']):
        return jsonify({"msg": "Accesso negato"}), 403
    order = Order.get(id)
    if order and (identity == order.agent_code or current_jwt['is_manager']):
        order.ord_amount = request.json['ord_amount']
        order.advance_amount = request.json['advance_amount']
        order.ord_date = request.json['ord_date']
        order.cust_code = request.json['cust_code']
        order.agent_code = request.json['agent_code']
        order.order_description = request.json['order_description']
        db.session.commit()
        return jsonify(order.toDict()), 200
    else:
        return jsonify({'msg': 'Order not found'}), 404

@app.route("/order", methods=["POST"])
@jwt_required()
def createOrder():
    identity = get_jwt_identity()
    current_jwt = get_jwt()
    if not current_jwt['is_agent']:
        return jsonify({"msg": "Accesso negato"}), 403
    else:
        order = Order(
            # ord_num = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(6)),
            # ord_num = random.randint(1, 10000000),
            ord_amount = request.json['ord_amount'],
            advance_amount = request.json['advance_amount'],
            ord_date = request.json['ord_date'],
            cust_code = request.json['cust_code'],
            agent_code = identity,
            order_description = request.json['order_description']
        )
        db.session.add(order)
        db.session.commit()
        return jsonify(order.toDict()), 200









##################
#     AGENTS     #
##################

@app.route("/agents", methods=["GET"])
@jwt_required()
def agents():
    current_jwt = get_jwt()
    if not current_jwt['is_manager']:
        return jsonify({"msg": "Accesso negato"}), 403
    return jsonify(list(map(lambda a: a.toDict(), Agent.getAll()))), 200

@app.route("/agent/<code>", methods=["GET"])
@jwt_required()
def agent(code):
    agent = Agent.get(code)
    if not agent:
        return jsonify({'msg': 'Agent not found'}), 404
    return jsonify(agent.toSmallDict()), 200

@app.route("/agents-resume", methods=["GET"])
@jwt_required()
def agents_resume():
    current_jwt = get_jwt()
    allowed = current_jwt['is_manager']
    if not allowed:
        return jsonify({"msg": "Accesso negato"}), 403
    return jsonify(list(map(lambda c: { 'name': c.agent_name, 'code': c.agent_code }, Agent.getAll()))), 200




##################
#   CUSTOMERS    #
##################

@app.route("/customers", methods=["GET"])
@jwt_required()
def customers():
    current_jwt = get_jwt()
    if current_jwt['is_manager']:
        return jsonify(list(map(lambda cust: cust.toDict(), Customer.getAll()))), 200
    elif current_jwt['is_agent']:
        identity = get_jwt_identity()
        return jsonify(list(map(lambda cust: cust.toDict(), Customer.getAllByAgent(identity)))), 200
    else:
        return jsonify({"msg": "Accesso negato"}), 403
    

@app.route("/customers-resume", methods=["GET"])
@jwt_required()
def customers_resume():
    current_jwt = get_jwt()
    if current_jwt['is_manager']:
        return jsonify(list(map(lambda c: { 'name': c.cust_name, 'code': c.cust_code }, Customer.getAll()))), 200
    elif current_jwt['is_agent']:
        identity = get_jwt_identity()
        return jsonify(list(map(lambda c: { 'name': c.cust_name, 'code': c.cust_code }, Customer.getAllByAgent(identity)))), 200
    else:
        return jsonify({"msg": "Accesso negato"}), 403


@app.route("/customer/<code>", methods=["GET"])
@jwt_required()
def customer(code):
    current_jwt = get_jwt()
    if not (current_jwt['is_manager'] or current_jwt['is_agent']):
        return jsonify({"msg": "Accesso negato"}), 403
    customer = Customer.get(code)
    if not customer:
        return jsonify({'msg': 'Customer not found'}), 404
    return jsonify(customer.toSmallDict()), 200


@app.route('/')
def root():
    return app.send_static_file('index.html')

# @app.route("/api/<name>")
# def hello_world(name):
#     return f'<p>Hello, {name}!</p>'

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)