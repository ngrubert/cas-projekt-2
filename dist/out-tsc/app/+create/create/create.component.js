var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { CreateService } from './../create.service';
import { Observable } from 'rxjs/Observable';
import { list } from './../../model/user';
export var CreateComponent = (function () {
    function CreateComponent(_createService, router, snackBar) {
        this._createService = _createService;
        this.router = router;
        // shoppingList :list; 
        this.model = new list(false);
        this.users = [];
        this.usersFirebase = [];
        this.emailedUsers = [];
        this.languages = ['English', 'German'];
        this.array = [];
        this.router = router;
        this.snackBar = snackBar;
    }
    CreateComponent.prototype.ngOnInit = function () {
        this.getUsers();
        this.addArticles();
    };
    CreateComponent.prototype.addArticles = function () {
        var catalog = { "Fruits & Vegetables": ["Apples", "Apricot", "Artichokes", "Asparagus", "Aubergine", "Avocado", "Bananas", "Basil", "Beetroot", "Berries", "Blackberries", "Blueberries", "Broccoli", "Cabbage", "Carrots", "Cauliflower", "Celery", "Cherries", "Cherry tomatoes", "Chillies", "Chives", "Coriander", "Courgette", "Cranberries", "Cucumber", "Dates", "Fennel", "Figs", "Fruits", "Garlic", "Ginger", "Grapefruit", "Grapes", "Herbs", "Kiwi fruit", "Leek", "Lemon", "Lettuce", "Lime", "Mandarins", "Mango", "Melon", "Mint", "Mushrooms", "Nectarine", "Olives", "Onions", "Orange", "Parsley", "Passion fruit", "Peach", "Pears", "Peas", "Pepper", "Pineaple", "Plums", "Potatoes", "Pumpkin", "Radish", "Raspberries", "Rhubarb", "Rocket", "Sage", "Salad", "Scallions", "Spinach", "Strawberries", "Sun-dried tomatoes", "Sweet Potatoes", "Sweet corn", "Thyme", "Tomatoes", "Vegetables", "Watermelon"],
            "Bread & Pastries": ["Bagels", "Baguette", "Bread", "Bred roll", "Burns", "Crispbread", "Croissant", "Crumpets", "Dinner rolles", "English Muffins", "Pancakes mix", "Pie", "Pizza dough", "Puff pastry", "Pumpkin Pie", "Scones", "Sliced bread", "Toast", "Tortillas", "Waffles"],
            "Milk & Cheese": ["Blue cheese", "Butter", "Cheddar", "Cheese", "Clotted cream", "Cottage cheese", "Cream", "Cream cheese", "Creme fraiche", "Eggs", "Feta", "Gorgonzola", "Grated cheese", "Margarine", "Mascarpone", "Milk", "Mozarella", "Parmesan"],
            "Meat & Fish": ["Anchovies", "Bacon", "Beef", "Bratwurst", "Chicken", "Chicken breast", "Cold cuts", "Fish", "Ham", "Lamb", "Lobster", "Meat", "Minced meat", "Mussels", "Oysters", "Pork", "Prawns", "Prosciutto", "Salami", "Salmon", "Sausage", "Sliced beef", "Steak", "Tuna", "Turkey", "Turkey breast", "Veal"],
            "Ingredients & Spices": ["Almonds", "BBQ sauce", "Baking powder", "Balsamic vinegar", "Beans", "Bicarbonate Soda", "Breadcrumbs", "Brown sauce", "Canned tomatoes", "Chutney", "Cinnamon", "Coconut milk", "Cornflour", "Cranberry sauce", "Dip", "Gravy", "Hazelnuts", "Hot sauce", "Icing sugar", "Ketchup", "Lentils", "Maple syrup", "Marmite", "Mashed potatoes", "Mayonnaise", "Mustard", "Nuts", "Oil", "Olive oil", "Oregano", "Paprika", "Pasta sauce", "Peanut butter", "Peppercorns", "Pickle", "Pine nuts", "Rosemary", "Salad dressing", "Salt", "Soy sauce", "Stock", "Sugar", "Tomato puree", "Tomato sauce", "Vanilla sugar", "Vinegar", "Walnuts", "Yeast"],
            "Frozen & Convenience": ["Bakde beans", "Burritos", "Chicken wings", "Chinese food", "Chips", "Dumplings", "Fish fingers", "Frozen vegetables", "Ice cream", "Pizza"],
            "Grain Products": ["Basmati rice", "Cereal", "Chickpeas", "Corn flakes", "Couscous", "Flour", "Muesli", "Noodles", "Oatmeal", "Pasta", "Penne", "Rice", "Risotto rice", "Semolina", "Spaghetti", "Tofu"],
            "Snacks & Sweets": ["Biscuits", "Cake", "Chewing gum", "Chocolate", "Christmas cookies", "Crackers", "Crisps", "Custard", "Dessert", "Dried fruits", "Gingerbread", "Honey", "Jam", "Jelly", "Lemon curd", "Marshmallows", "Nougat cream", "Peanuts", "Pop corn", "Pretzels", "Snacks", "Sweets", "Tortilla chips"],
            "Beverage & Tobacco": ["Ale", "Apple juice", "Beer", "Beverages", "Bottled water", "Champagne", "Cider", "Cigarettes", "Coffe", "Cola", "Diet Cola", "Diet soda", "Energy drink", "Fruit juice", "Gin", "Ginger Ale", "Hot chocolate", "Iced tea", "Orange juice", "Prosecco", "Red wine", "Rum", "Smoothie", "Soda", "Spirits", "Sports drink", "Tea", "Tonic water", "Vodka", "Water", "Whisky", "White wine"],
            "Household & Health": ["Aluminium foil", "Baby food", "Bathroom cleaner", "Batteries", "Body lotion", "Candles", "Charcoal", "Cleaning supplies", "Cling film", "Conditioner", "Cotton pads", "Cotton swabs", "Dental floss", "Deodorant", "Dishwater salt", "Dishwater tabs", "Fabric softener", "Face cream", "Facial tissues", "Flowers", "Glass cleaner", "Hair gel", "Hair spray", "Hand cream", "Insect repellent", "Laundry detergent", "Light bulb", "Makeup remover", "Mouthwash", "Nail polish", "Nail polish remove", "Napkins", "Nappies", "Painkiller", "Paper towels", "Razor", "Razor blades", "Shampoo", "Shaving cream", "Shower gel", "Soap", "Sponge", "Sunscreen", "Tampons", "Tissues", "Toilet cleaner", "Toilet paper", "Tootbrush", "Toothpaste", "Vitamins", "Washing-up liquid", "Wrapping paper"],
            "Pet Supplies": ["Bird food", "Cat food", "Cat litter", "Cat treats", "Dog food", "Dog treats", "Fish food"],
        };
        // this._createService.createFirebaseCatalog(catalog);
    };
    CreateComponent.prototype.ngOnDestroy = function () {
        // this.reqSubscribe.unsubscribe();
    };
    CreateComponent.prototype.CreateList = function () {
        console.log(this.model);
        // this.model.users.push(this.model.email);
        // this.model.users.push(this.initialEmail);
        this.array = [];
        this.inviteUsers = JSON.parse(JSON.stringify(this.users));
        this.inviteUsers.push(this.initialEmail);
        this.inviteUsers.push(this.model.email);
        console.log(this.inviteUsers);
        this.CheckUsers();
    };
    CreateComponent.prototype.addInvitedUsers = function () {
        this.users.push('');
    };
    CreateComponent.prototype.customTrackBy = function (index, obj) {
        return index;
    };
    CreateComponent.prototype.ItemNotIn = function (obj) {
        var exists = this.exists.filter(function (item) {
            return item.email === obj.email;
        });
        if (exists && exists.length > 0) {
            return false;
        }
        else {
            return true;
        }
    };
    CreateComponent.prototype.CheckUsers = function () {
        var _this = this;
        var self = this;
        self.emailedUsers = [];
        for (var i = 0; i < this.inviteUsers.length; i++) {
            if (this.inviteUsers && this.inviteUsers[i] != "") {
                var obj = {
                    email: this.inviteUsers[i]
                };
                self.array.push(obj);
            }
        }
        this.model.isFinished = false;
        var sListTemp = this.model;
        sListTemp.users = [];
        var sListCreated$ = self._createService.createSList(sListTemp);
        sListCreated$.subscribe(function (x) {
            _this.sList = x;
            _this.sListKey = x.$key;
        });
        self._createService.resetSList();
        var request$ = Observable.from(this.array)
            .mergeMap(function (data) {
            return _this.addIfnotExists(data);
        })
            .mergeMap(function (data) {
            return _this.getUserObjs(data);
        })
            .map(function (data) {
            _this.createSListUser(data);
            return _this.sendKeys(data);
        });
        // .map(data=>{
        //     this.sendEmail(data);
        //     return this.sendKeys(data);
        // });
        this.reqSubscribe = request$.subscribe(function (val) {
            if (val) {
                self.emailedUsers.push(val);
                if (self.emailedUsers.length == self.inviteUsers.length) {
                    if (self.sList) {
                        var userEmailKey = self.emailedUsers.find(self.findUserEmailKey, self);
                        self.router.navigate([("list/" + self.sListKey), { email: userEmailKey.$key }]);
                    }
                }
            }
            console.log(val);
        });
        // if(!window.navigator.onLine)
        // {
        //     self.snackBar.open('Shopping List will be Created and email will be sent, once device comes online, Don\'t close the Browser', 'Okay');
        // }
    };
    CreateComponent.prototype.findUserEmailKey = function (item) {
        return item.email == this.model.email;
    };
    CreateComponent.prototype.sendKeys = function (data) {
        return data;
    };
    CreateComponent.prototype.sendEmail = function (usr) {
        if (usr) {
            this._createService.sendEmailToUser(usr);
        }
    };
    CreateComponent.prototype.createSListUser = function (usr) {
        if (usr) {
            this._createService.createSListUser(usr);
            console.log(usr);
        }
    };
    CreateComponent.prototype.getUserObjs = function (usr) {
        var self = this;
        return self._createService.getItemFromFirebase(usr.email)
            .map(function (x) { return x; });
    };
    CreateComponent.prototype.addIfnotExists = function (usr) {
        var self = this;
        var exists = self.usersFirebase.filter(function (item) { return item.email == usr.email; });
        if (exists && exists.length > 0) { }
        else {
            self._createService.addtoFirebase(usr);
        }
        var arr = [];
        arr.push(usr);
        return Observable.from(arr);
    };
    CreateComponent.prototype.getUsers = function () {
        var _this = this;
        this._createService.getUsersFirebase()
            .subscribe(function (users) {
            _this.usersFirebase = users;
        }, //Bind to view
        function (//Bind to view
            err) {
            // Log errors if any
            console.log(err);
        });
    };
    CreateComponent = __decorate([
        Component({
            selector: 'create',
            templateUrl: './create.component.html',
            styleUrls: ['./create.component.scss'],
            providers: [CreateService, MdSnackBar]
        }), 
        __metadata('design:paramtypes', [CreateService, Router, MdSnackBar])
    ], CreateComponent);
    return CreateComponent;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/+create/create/create.component.js.map