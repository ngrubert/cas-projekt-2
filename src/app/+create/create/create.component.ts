import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {MdSnackBar} from '@angular/material';
import {FirebaseObjectObservable} from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import {TranslateService} from '@ngx-translate/core';

import {SharedComponent} from './../../shared/shared.component';
import {CreateService} from './../create.service';
import {user} from './../../model/user';
import {list} from './../../model/user';

@Component({
    selector: 'create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    providers: [CreateService, MdSnackBar]
})
export class CreateComponent implements OnInit,OnDestroy {
    // shoppingList :list; 
    model = new list(false);
    title: string;
    users = [];
    usersFirebase = [];
    initialEmail: string;
    inviteUsers: Array<string>;
    emailedUsers: Array<any> = [];
    lang: string;
    languages = ['Select catalog language', 'English', 'German'];
    exists: user[];
    notexists: user[];
    array: Array<any> = [];
    sList: FirebaseObjectObservable<any>;
    reqSubscribe;
    sListKey: string;
    snackBar;

    constructor(public _createService: CreateService,
                private router: Router,
                snackBar: MdSnackBar,
                private translate: TranslateService) {
        this.router = router;
        this.snackBar = snackBar;
        this.lang = translate.currentLang;
    }

    ngOnInit() {
        this.model.language = this.languages[0];
        // get all users
        this.getUsers();
        // add articles
        this.addArticles();
    }

    addArticles() {
        let catalog = {
            "Fruits & Vegetables|Früchte & Gemüse": [
                "Apples|Äpfel|apple",
                "Apricot|Aprikosen|apricot",
                "Artichokes|Artischocken|empty",
                "Asparagus|Spargeln|empty",
                "Aubergine|Auberginen|empty",
                "Avocado|Avocados|empty",
                "Bananas|Bananen|banana",
                "Bell peppers|Peperoni|peperoni",
                "Berries|Beeren|empty",
                "Blackberries|Brombeeren|empty",
                "Blueberries|Blaubeeren|empty",
                "Broccoli|Broccoli|broccoli",
                "Cabbage|Weisskohl|empty",
                "Carrots|Karotten|empty",
                "Cauliflower|Blumenkohl|empty",
                "Celery|Sellerie|empty",
                "Cherries|Kirschen|empty",
                "Cherry tomatoes|Cherrytomaten|empty",
                "Chillies|Chillies|empty",
                "Chives|Schnittlauch|empty",
                "Clementins|Clementinen|empty",
                "Courgette|Zucchetti|empty",
                "Cranberries|Cranberries|empty",
                "Cucumber|Salatgurken|empty",
                "Dates|Datteln|empty",
                "Fennel|Fenchel|empty",
                "Figs|Feigen|empty",
                "Garlic|Knoblauch|empty",
                "Grapefruit|Grapefruits|empty",
                "Grapes|Trauben|grape",
                "Herbs|Kräuter|empty",
                "Kiwi fruit|Kiwi|empty",
                "Leek|Lauch|empty",
                "Lemon|Zitronen|empty",
                "Lettuce|Lattich|empty",
                "Lime|Limonen|empty",
                "Mandarins|Mandarinen|empty",
                "Mango|Mango|empty",
                "Melon|Melonen|empty",
                "Mushrooms|Pilze|empty",
                "Nectarine|Nektarinen|empty",
                "Olives|Oliven|empty",
                "Onions|Zwiebeln|empty",
                "Orange|Orangen|empty",
                "Passion fruit|Passionsfrucht|empty",
                "Peach|Pfirsiche|empty",
                "Pears|Birnen|pear",
                "Peas|Erbsen|empty",
                "Pineaple|Ananas|empty",
                "Plums|Pflaumen|empty",
                "Potatoes|Kartoffeln|empty",
                "Pumpkin|Kürbis|pumpkin",
                "Radish|Radieschen|empty",
                "Raspberries|Himbeeren|empty",
                "Rhubarb|Rhabarber|empty",
                "Rocket|Rucola|empty",
                "Salad|Salat|empty",
                "Spinach|Spinat|empty",
                "Strawberries|Erdbeeren|empty",
                "Sun-dried tomatoes|Getrocknete Tomaten|empty",
                "Sweet Potatoes|Süsskartoffeln|empty",
                "Sweet corn|Maiskolben|empty",
                "Tomatoes|Tomaten|empty",
                "Vegetables|Gemüse|empty",
                "Watermelon|Wassermelonen|empty"
            ],
            "Bread & Pastries|Brot & Gebäck": [
                "Bagels|Bagel|empty",
                "Baguette|Baguette|empty",
                "Bread|Brot|empty",
                "Bred roll|Brötchen|empty",
                "Crispbread|Knäckebrot|empty",
                "Croissant|Gipfeli|empty",
                "English Muffins|Muffins|empty",
                "Pancakes mix|Pancake-Mischung|empty",
                "Pie|Kuchen|empty",
                "Pizza dough|Pizzateig|empty",
                "Puff pastry|Blätterteiggebäck|empty",
                "Pumpkin Pie|Kürbiskuchen|empty",
                "Scones|Scones|empty",
                "Sliced bread|Toastbrot|empty",
                "Tortillas|Tortillas|empty",
                "Waffles|Waffeln|empty"
            ],
            "Milk & Cheese|Milch & Käse": [
                "Blue cheese|Blauschimmelkäse|empty",
                "Butter|Butter|empty",
                "Cheddar|Cheddar|empty",
                "Cheese|Käse|cheese",
                "Cottage cheese|Cottage cheese|empty",
                "Cream|Rahm|empty",
                "Cream cheese|Frischkäse|empty",
                "Creme fraiche|Creme fraiche|empty",
                "Eggs|Eier|empty",
                "Feta|Feta|empty",
                "Gorgonzola|Gorgonzola|empty",
                "Grated cheese|Reibkäse|empty",
                "Margarine|Margarine|empty",
                "Mascarpone|Mascarpone|empty",
                "Milk|Milch|empty",
                "Mozarella|Mozarella|empty",
                "Parmesan|Parmesan|empty"
            ],
            "Meat & Fish|Fleisch & Fisch": [
                "Anchovies|Anchovis|empty",
                "Bacon|Speck|empty",
                "Beef|Rindfleisch|empty",
                "Bratwurst|Bratwurst|empty",
                "Chicken|Pouletfleisch|empty",
                "Chicken breast|Pouletbrust|empty",
                "Cold cuts|Aufschnitt|empty",
                "Fish|Fisch|fish",
                "Ham|Schinken|empty",
                "Lamb|Lammfleisch|empty",
                "Lobster|Hummer|empty",
                "Meat|Fleisch|empty",
                "Minced meat|Hackfleisch|empty",
                "Mussels|Muscheln|empty",
                "Oysters|Austern|empty",
                "Pork|Schweinefleisch|empty",
                "Prawns|Scampi|empty",
                "Prosciutto|Rohschinken|empty",
                "Salami|Salami|empty",
                "Salmon|Lachs|empty",
                "Sausage|Würstchen|empty",
                "Sliced beef|Sliced beef|empty",
                "Steak|Steak|empty",
                "Tuna|Thon|empty",
                "Turkey|Trutenfleisch|empty",
                "Turkey breast|Trutenbrust|empty",
                "Veal|Kalbfleisch|empty"
            ],
            "Ingredients & Spices|Zutaten & Gewürze": [
                "Almonds|Mandeln|empty",
                "BBQ sauce|BBQ-Sauce|empty",
                "Baking powder|Backpulver|empty",
                "Balsamic vinegar|Balsamico|empty",
                "Beans|Bohnen|empty",
                "Bicarbonate Soda|Natron|empty",
                "Breadcrumbs|Paniermehl|empty",
                "Brown sauce|Bratensauce|empty",
                "Canned tomatoes|Pelati|empty",
                "Chutney|Mango Chutney|empty",
                "Cinnamon|Zimt|empty",
                "Coconut milk|Kokosmilk|empty",
                "Coriander|Koriander|empty",
                "Cornflour|Maizena|empty",
                "Cranberry sauce|Cranberry sauce|empty",
                "Dip|Dip|empty",
                "Ginger|Ingwer|empty",
                "Gravy|Sauce|empty",
                "Hazelnuts|Haselnüsse|empty",
                "Hot sauce|Hot sauce|empty",
                "Icing sugar|Puderzucker|empty",
                "Ketchup|Ketchup|empty",
                "Lentils|Linsen|empty",
                "Maple syrup|Ahornsirup|empty",
                "Mashed potatoes|Stocki|empty",
                "Mayonnaise|Mayonnaise|empty",
                "Mint|Pfefferminze|empty",
                "Mustard|Senf|empty",
                "Nuts|Nüsse|empty",
                "Oil|Öl|empty",
                "Olive oil|Olivenöl|empty",
                "Oregano|Oregano|empty",
                "Paprika|Paprika|empty",
                "Pasta sauce|Tomatensauce|empty",
                "Parsley|Petersilie|empty",
                "Peanut butter|Erdnussbutter|empty",
                "Pepper|Pfeffer|empty",
                "Pickle|Salzgurken|empty",
                "Pine nuts|Pinienkerne|empty",
                "Rosemary|Rosemarin|empty",
                "Sage|Salbei|empty",
                "Salad dressing|Salatsauce|empty",
                "Salt|Salz|empty",
                "Soy sauce|Sojasauce|empty",
                "Stock|Vorräte|empty",
                "Sugar|Zucker|empty",
                "Thyme|Thymian|empty",
                "Tomato puree|Tomatenpürree|empty",
                "Vanilla sugar|Vanillezucker|empty",
                "Vinegar|Essig|empty",
                "Walnuts|Walnüsse|empty",
                "Yeast|Hefe|empty"
            ],
            "Frozen & Convenience|Fertig- & Tiefkühlprodukte": [
                "Baked beans|Baked beans|empty",
                "Burritos|Burritos|empty",
                "Chicken wings|Chicken wings|empty",
                "Chinese food|Chinese food|empty",
                "Chips|Chips|empty",
                "Dumplings|Dumplings|empty",
                "Fish fingers|Fischstäbli|empty",
                "Frozen vegetables|Gemüse tiefgeroren|empty",
                "Ice cream|Glace|icecream",
                "Lasagne|Lasagne|empty",
                "French Fries|Ofen-Frites|empty",
                "Pizza|Pizza|empty",
                "Ravioli|Ravioli|empty",
                "Tortelloni|Tortellone|empty"
            ],
            "Grain Products|Getreideprodukte": [
                "Basmati rice|Basmatireis|empty",
                "Cereal|Frühstücksflocken|empty",
                "Chickpeas|Kichererbsen|empty",
                "Corn flakes|Corn Flakes|empty",
                "Couscous|Couscous|empty",
                "Flour|Mehl|empty",
                "Muesli|Müesli|empty",
                "Noodles|Nudeln|empty",
                "Oatmeal|Haferflocken|empty",
                "Pasta|Pasta|empty",
                "Penne|Penne|empty",
                "Rice|Reis|empty",
                "Risotto rice|Risottoreis|empty",
                "Semolina|Griess|empty",
                "Spaghetti|Spaghetti|empty",
                "Tofu|Tofu|empty"
            ],
            "Snacks & Sweets|Snacks & Süsses": [
                "Biscuits|Biscuits|empty",
                "Cake|Cake|empty",
                "Chewing gum|Kaugummi|empty",
                "Chocolate|Schokolade|empty",
                "Christmas cookies|Weihnachtsguetsli|empty",
                "Crackers|Crackers|empty",
                "Crisps|Chips|empty",
                "Custard|Creme|empty",
                "Dessert|Dessert|empty",
                "Donuts|Donuts|donut",
                "Dried fruits|Dörrfrüchte|empty",
                "Gingerbread|Lebkuchen|empty",
                "Honey|Honig|empty",
                "Jam|Konfitüre|konfituere",
                "Jelly|Jelly|empty",
                "Marshmallows|Marshmallows|empty",
                "Nougat cream|Nutella|empty",
                "Peanuts|Erdnüsschen|empty",
                "Pop corn|Popcorn|empty",
                "Pretzels|Salzgebäck|empty",
                "Snacks|Snacks|empty",
                "Sweets|Bonbons|empty",
                "Tortilla chips|Tortilla chips|empty"
            ],
            "Beverage & Tobacco|Beverage & Tobacco": [
                "Ale|Ale|empty",
                "Apple juice|Apfelsaft|empty",
                "Beer|Bier|empty",
                "Beverages|Getränke|empty",
                "Bottled water|Mineralwasser|empty",
                "Champagne|Champagner|empty",
                "Cider|Most|empty",
                "Cigarettes|Zigaretten|empty",
                "Coffe|Kaffee|empty",
                "Cola|Cola|empty",
                "Diet Cola|Cola light|empty",
                "Diet soda|Süssgetränke light|empty",
                "Energy drink|Energy drink|empty",
                "Fruit juice|Fruchtsaft|empty",
                "Gin|Gin|empty",
                "Ginger Ale|Ginger Ale|empty",
                "Hot chocolate|Schoggidrink|empty",
                "Iced tea|Eistee|empty",
                "Orange juice|Orangensaft|empty",
                "Prosecco|Prosecco|empty",
                "Red wine|Rotwein|empty",
                "Rum|Rum|empty",
                "Smoothie|Smoothie|empty",
                "Soda|Süssgetränke|empty",
                "Spirits|Spirits|empty",
                "Sports drink|Isotonisches Getränk|empty",
                "Tea|Tee|empty",
                "Tonic water|Tonic|empty",
                "Vodka|Wodka|empty",
                "Whisky|Whisky|empty",
                "White wine|Weisswein|empty"
            ],
            "Household & Health|Haushalt & Gesundheit": [
                "Aluminium foil|Aluminiumfolie|empty",
                "Baby food|Babynahrung|empty",
                "Bathroom cleaner|Badreiniger|empty",
                "Batteries|Batterien|empty",
                "Body lotion|Body lotion|empty",
                "Candles|Kerzen|empty",
                "Charcoal|Holzkohle|empty",
                "Cleaning supplies|Reinigungsmittel|empty",
                "Cling film|Frischhaltefolie|empty",
                "Conditioner|Haar-Spülung|empty",
                "Cotton pads|Wattebäusche|empty",
                "Cotton swabs|Wattestäbchen|empty",
                "Dental floss|Zahnseide|empty",
                "Deodorant|Deo|empty",
                "Dishwater salt|Regeneriersalz|empty",
                "Dishwater tabs|Spülmaschinen-Pulver|empty",
                "Fabric softener|Gewebeveredler|empty",
                "Face cream|Gesischtscreme|empty",
                "Facial tissues|Gesischtspads|empty",
                "Flowers|Blumen|empty",
                "Glass cleaner|Glasreiniger|empty",
                "Hair gel|Haargel|empty",
                "Hair spray|Haarspray|empty",
                "Hand cream|Handcreme|empty",
                "Insect repellent|Antibrumm|empty",
                "Laundry detergent|Waschmittel|empty",
                "Light bulb|Leuchtmittel|empty",
                "Makeup remover|Makeup-Entferner|empty",
                "Mouthwash|Mundspülung|empty",
                "Nail polish|Nagellack|empty",
                "Nail polish remove|Nagellackentferner|empty",
                "Napkins|Papierservicetten|empty",
                "Nappies|Windeln|empty",
                "Painkiller|Schmerzmittel|empty",
                "Paper towels|Haushaltspapier|empty",
                "Razor|Rasierer|empty",
                "Razor blades|Rasierklingen|empty",
                "Shampoo|Shampoo|empty",
                "Shaving cream|Rasierschaum|empty",
                "Shower gel|Duschgel|empty",
                "Soap|Seife|empty",
                "Sponge|Schwamm|empty",
                "Sunscreen|Sonnenschutz|empty",
                "Tampons|Tampons|empty",
                "Tissues|Kleenex|empty",
                "Toilet cleaner|WC-Reiniger|empty",
                "Toilet paper|WC-Papier|empty",
                "Tootbrush|Zahnbürste|empty",
                "Toothpaste|Zahnpasta|empty",
                "Vitamins|Vitamine|empty",
                "Washing-up liquid|Spülmittel|empty",
                "Wrapping paper|Geschenkpapier|empty"
            ],
            "Pet Supplies|Tierfutter": [
                "Bird food|Vogelfutter|empty",
                "Cat food|Katzenfutter|empty",
                "Cat litter|Katzenstreu|empty",
                "Cat treats|Katzenbiscuits|empty",
                "Dog food|Hundefutter|empty",
                "Dog treats|Hundebiscuits|empty",
                "Fish food|Fischfutter|empty"
            ],
        };

        //this._createService.createFirebaseCatalogx(catalog);
    }

    ngOnDestroy() {
        // this.reqSubscribe.unsubscribe();
    }

    // create shoppingList
    CreateList() {
        console.log(this.model);
        // this.model.users.push(this.model.email);
        // this.model.users.push(this.initialEmail);
        this.array = [];
        this.inviteUsers = JSON.parse(JSON.stringify(this.users));
        if (this.initialEmail && this.initialEmail != "") {
            this.inviteUsers.push(this.initialEmail);
        }
        this.inviteUsers.push(this.model.email);
        console.log(this.inviteUsers);
        this.CheckUsers();
    }

    // add inviteUsers
    addInvitedUsers() {
        this.users.push('');
    }

    // angular2 pipe for filtering in ui
    customTrackBy(index: number, obj: any): any {
        return index;
    }

    // item not exists
    ItemNotIn(obj) {
        let exists = this.exists.filter(function (item) {
            return item.email === obj.email;
        });
        if (exists && exists.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    // check if users exists and edit shoppingList and save users
    CheckUsers() {
        let self = this;
        self.emailedUsers = [];
        for (let i = 0; i < this.inviteUsers.length; i++) {
            if (this.inviteUsers && this.inviteUsers[i] != "") {
                let obj = {
                    email: this.inviteUsers[i]
                }
                self.array.push(obj);
            }
        }

        this.model.isFinished = false;
        this.model.siteUrl = window.location.origin;
        let sListTemp: list = this.model;
        sListTemp.users = [];
        let sListCreated$ = self._createService.createSList(sListTemp);
        sListCreated$.subscribe(x => {
            this.sList = x;
            this.sListKey = x.$key;
        });
        self._createService.resetSList();

        let request$ = Observable.from(this.array)
            .mergeMap(data => {
                return this.addIfnotExists(data);
            })
            .mergeMap(data => {
                return this.getUserObjs(data);
            })
            .map(data => {
                this.createSListUser(data);
                return this.sendKeys(data);
            });
        // .map(data=>{
        //     this.sendEmail(data);
        //     return this.sendKeys(data);
        // });

        this.reqSubscribe = request$.subscribe(
            val => {
                if (val) {
                    self.emailedUsers.push(val);
                    if (self.emailedUsers.length == self.inviteUsers.length) {
                        if (self.sList) {
                            let userEmailKey = self.emailedUsers.find(self.findUserEmailKey, self);
                            self.router.navigate([`list/${self.sListKey}`, {email: userEmailKey.$key}])
                        }
                    }
                }
                console.log(val);
            }
        );
        // if (!window.navigator.onLine)
        // {
        //     self.snackBar.open('Shopping List will be Created and email will be sent, once device comes online, Don\'t close the Browser', 'Okay');
        // }

    }

    // find user email by key
    findUserEmailKey(item: any): boolean {
        return item.email == this.model.email;
    }

    // send email by keys
    sendKeys(data: any): Observable<any> {
        return data;
    }

    sendEmail(usr: any): void {
        if (usr) {
            this._createService.sendEmailToUser(usr);
        }
    }

    // create shopping list user
    createSListUser(usr): void {
        if (usr) {
            this._createService.createSListUser(usr);
            console.log(usr);
        }
    }

    // get users 
    getUserObjs(usr: user): Observable<user> {
        var self = this;
        return self._createService.getItemFromFirebase(usr.email)
            .map(x => x);
    }

    // add if users not exists
    addIfnotExists(usr: user): Observable<user> {
        var self = this;
        let exists = self.usersFirebase.filter((item) => item.email == usr.email);
        if (exists && exists.length > 0) {
        }
        else {
            self._createService.addtoFirebase(usr);
        }
        let arr = [];
        arr.push(usr);
        return Observable.from(arr);
    }

    // get users
    getUsers() {
        this._createService.getUsersFirebase()
            .subscribe(
                users => {
                    this.usersFirebase = users;
                }, //Bind to view
                err => {
                    // Log errors if any
                    console.log(err);
                });
    }

}