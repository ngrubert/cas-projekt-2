import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {MdSnackBar} from '@angular/material';
import {FirebaseObjectObservable} from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import {TranslateService} from '@ngx-translate/core';

import {SharedComponent} from './../../shared/shared.component';
import {CreateService} from './../create.service';
import {LocalStateService} from './../../services/localstate.service';
import {user} from './../../model/user';
import {list} from './../../model/user';

@Component({
    selector: 'create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    providers: [CreateService, MdSnackBar]
})
export class CreateComponent implements OnInit,OnDestroy {
    private user;
    model = new list(false);
    title: string;
    users = [];
    usersFirebase = [];
    initialEmail: string;
    inviteUsers: Array<string>;
    emailedUsers: Array<any> = [];
    emailAddrs: Array<any> = [];
    sList: FirebaseObjectObservable<any>;
    sListKey: string;
    private reqSubscribe;
    private paramObs;
    snackBar;

    constructor(public _createService: CreateService,
                private route: ActivatedRoute,
                private router: Router,
                snackBar: MdSnackBar,
                private translate: TranslateService) {
        this.router = router;
        this.snackBar = snackBar;
    }

    ngOnInit() {
        // let newLang: string;
        // this.paramObs = this.route.params.subscribe(params => {
        //     newLang = params['lang'];
        // });
        // console.log("cur="+this.translate.currentLang+", param:"+newLang);
        // if (newLang != this.translate.currentLang) {
        //     this.translate.use(newLang);
        //     LocalStateService.setLanguage(newLang);
        //     window.location.reload();
        // }
        // pre-fill Name and email fields from existing sList if there is one
        let key = LocalStateService.getSListKey();
        if (key) {
            let currentSList = this._createService.getSListData(key);
            currentSList.subscribe(x => {
                if (x) {
                    this.model.email = x.email;
                    this.model.name = x.name;
                }
            })
        }
        // this.model.language = this.languages[0];
        // get all users
        this.getUsers();
        // add articles
        this.addArticles();
    }

    ngOnDestroy() {
        // this.reqSubscribe.unsubscribe();
        // this.paramObs.unsubscribe();
    }

    // Create shoppingList. This is called by the "create shopping list" button
    createList() {
        this.emailAddrs = [];
        this.inviteUsers = JSON.parse(JSON.stringify(this.users));
        if (this.initialEmail && this.initialEmail.trim() != "") {
            this.inviteUsers.push(this.initialEmail);
        }
        for (let i = 0; i < this.inviteUsers.length; i++) {
            this.inviteUsers[i] = this.inviteUsers[i].trim();
        }
        this.inviteUsers.push(this.model.email);
        this.CheckUsers();
    }

    // This is called by the "add more users" button. Adds an invitedusers text field, initially blank
    addInvitedUsers() {
        this.users.push('');
    }

    // angular2 pipe for filtering in ui
    customTrackBy(index: number, obj: any): any {
        return index;
    }


    // check if users exists and edit shoppingList and save users
    CheckUsers() {
        let self = this;
        self.emailedUsers = [];
        for (let i = 0; i < this.inviteUsers.length; i++) {
            if (this.inviteUsers && this.inviteUsers[i] != "") {
                let obj = {
                    email: this.inviteUsers[i].trim()
                }
                self.emailAddrs.push(obj);
            }
        }
        this.model.isFinished = false;
        let sListTemp: list = this.model;
        sListTemp.siteUrl = window.location.origin;
        sListTemp.language = this.translate.currentLang;
        sListTemp.users = [];
        let sListCreated$ = self._createService.createSList(sListTemp);
        sListCreated$.subscribe(x => {
            this.sList = x;
            this.sListKey = x.$key;
        });
        self._createService.resetSList();

        // foreach email addr
        // - check if the firebase /users/key exists, if not, create it
        // - get the user object
        // - create the firebase /sListUsers/ object
        let request$ = Observable.from(this.emailAddrs)
            .mergeMap(data => {
                return this.addUserIfNotExists(data);
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

        // we have an all new sList and a local user, store in local db

        // route to the list, params=sllist-key, email-key
        this.reqSubscribe = request$.subscribe(
            val => {
                if (val) {
                    self.emailedUsers.push(val);
                    if (self.emailedUsers.length == self.inviteUsers.length) {
                        if (self.sList) {
                            let userEmailKey = self.emailedUsers.find(self.findUserEmailKey, self);
                            LocalStateService.setUserKey(userEmailKey.$key);
                            LocalStateService.setSListKey(self.sListKey);
                            self.router.navigate([`list/${self.sListKey}`, {email: userEmailKey.$key}])
                        }
                    }
                }
            }
        );

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
        }
    }

    // get users 
    getUserObjs(usr: user): Observable<user> {
        let self = this;
        return self._createService.getUserFromFirebase(usr.email)
            .map(x => x);
    }

    // add if users not exists
    addUserIfNotExists(usr: user): Observable<user> {
        let self = this;
        let exists = self.usersFirebase.filter((item) => item.email == usr.email);
        if (!exists || exists.length == 0) {
            self._createService.addUserToFirebase(usr);
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

    addArticles() {
        let catalog = {
            "Fruits & Vegetables|Früchte & Gemüse": [
                "Apples|Äpfel|apfel",
                "Apricot|Aprikosen|apricot",
                "Artichokes|Artischocken|empty",
                "Asparagus|Spargeln|spargel",
                "Aubergine|Auberginen|aubergine",
                "Avocado|Avocados|empty",
                "Bananas|Bananen|banane",
                "Bell peppers|Peperoni|peperoni",
                "Berries|Beeren|empty",
                "Blackberries|Brombeeren|empty",
                "Blueberries|Blaubeeren|empty",
                "Broccoli|Broccoli|broccoli",
                "Cabbage|Weisskohl|empty",
                "Carrots|Karotten|karotten",
                "Cauliflower|Blumenkohl|empty",
                "Celery|Sellerie|empty",
                "Cherries|Kirschen|kirsche",
                "Cherry tomatoes|Cherrytomaten|empty",
                "Chillies|Chillies|empty",
                "Chives|Schnittlauch|empty",
                "Clementins|Clementinen|empty",
                "Courgette|Zucchetti|empty",
                "Cranberries|Cranberries|empty",
                "Cucumber|Salatgurke|gurke",
                "Dates|Datteln|empty",
                "Fennel|Fenchel|empty",
                "Figs|Feigen|empty",
                "Garlic|Knoblauch|knoblauch",
                "Grapefruit|Grapefruits|empty",
                "Grapes|Trauben|traube",
                "Herbs|Kräuter|empty",
                "Kiwi fruit|Kiwi|empty",
                "Leek|Lauch|empty",
                "Lemon|Zitronen|zitrone",
                "Lettuce|Lattich|empty",
                "Lime|Limonen|empty",
                "Mandarins|Mandarinen|empty",
                "Mango|Mango|empty",
                "Melon|Melonen|melone",
                "Mushrooms|Pilze|pilz",
                "Nectarine|Nektarinen|empty",
                "Olives|Oliven|empty",
                "Onions|Zwiebeln|zwiebel",
                "Orange|Orangen|empty",
                "Passion fruit|Passionsfrucht|empty",
                "Peach|Pfirsiche|empty",
                "Pears|Birnen|birne",
                "Peas|Erbsen|erbsen",
                "Pineaple|Ananas|empty",
                "Plums|Pflaumen|pflaume",
                "Potatoes|Kartoffeln|empty",
                "Pumpkin|Kürbis|kuerbis",
                "Radish|Radieschen|radieschen",
                "Raspberries|Himbeeren|empty",
                "Rhubarb|Rhabarber|empty",
                "Rocket|Rucola|empty",
                "Salad|Salat|empty",
                "Spinach|Spinat|empty",
                "Strawberries|Erdbeeren|erdbeere",
                "Sun-dried tomatoes|Getrocknete Tomaten|tomate",
                "Sweet Potatoes|Süsskartoffeln|empty",
                "Sweet corn|Maiskolben|mais",
                "Tomatoes|Tomaten|tomate",
                "Vegetables|Gemüse|empty",
                "Watermelon|Wassermelone|melone"
            ],
            "Bread & Pastries|Brot & Gebäck": [
                "Bagels|Bagel|empty",
                "Baguette|Baguette|empty",
                "Bread|Brot|brot",
                "Bred roll|Brötchen|empty",
                "Crispbread|Knäckebrot|empty",
                "Croissant|Gipfeli|gipfeli",
                "English Muffins|Muffins|muffin",
                "Pancakes mix|Pancake-Mischung|empty",
                "Pie|Kuchen|torte",
                "Pizza dough|Pizzateig|empty",
                "Puff pastry|Blätterteiggebäck|empty",
                "Pumpkin Pie|Kürbiskuchen|empty",
                "Scones|Scones|empty",
                "Sliced bread|Toastbrot|toastbrot",
                "Tortillas|Tortillas|empty",
                "Waffles|Waffeln|empty",
                "Zopf|Zopf|zopf"
            ],
            "Milk & Cheese|Milch & Käse": [
                "Blue cheese|Blauschimmelkäse|empty",
                "Butter|Butter|butter",
                "Cheddar|Cheddar|empty",
                "Cheese|Käse|kaese",
                "Cooked eggs|Picknickeier|picknickeier",
                "Cottage cheese|Cottage cheese|empty",
                "Cream|Rahm|empty",
                "Cream cheese|Frischkäse|empty",
                "Creme fraiche|Creme fraiche|empty",
                "Eggs|Eier|ei",
                "Feta|Feta|empty",
                "Gorgonzola|Gorgonzola|empty",
                "Grated cheese|Reibkäse|empty",
                "Margarine|Margarine|empty",
                "Mascarpone|Mascarpone|empty",
                "Milk|Milch|milch",
                "Mozarella|Mozarella|empty",
                "Parmesan|Parmesan|empty"
            ],
            "Meat & Fish|Fleisch & Fisch": [
                "Anchovies|Anchovis|fischchen",
                "Bacon|Speck|empty",
                "Beef|Rindfleisch|rindfleisch",
                "Bratwurst|Bratwurst|bratwurst",
                "Chicken|Pouletfleisch|poulet",
                "Chicken breast|Pouletbrust|poulet",
                "Cold cuts|Aufschnitt|empty",
                "Geschnetzeltes|Geschnetzeltes|geschnetzeltes",
                "Fish|Fisch|fisch",
                "Ham|Schinken|empty",
                "Hamburger|Hamburger|hamburger",
                "Lamb|Lammfleisch|empty",
                "Lobster|Hummer|empty",
                "Meat|Fleisch|empty",
                "Minced meat|Hackfleisch|hackfleisch",
                "Mixed grill|Spiessli|spiessli",
                "Mussels|Muscheln|empty",
                "Oysters|Austern|empty",
                "Pork|Schweinefleisch|schweinefleisch",
                "Prawns|Scampi|empty",
                "Prosciutto|Rohschinken|empty",
                "Salami|Salami|empty",
                "Salmon|Lachs|empty",
                "Sausage|Würstchen|wurst",
                "Sliced beef|Sliced beef|empty",
                "Steak|Steak|empty",
                "Tuna|Thon|fisch",
                "Turkey|Trutenfleisch|empty",
                "Turkey breast|Trutenbrust|empty",
                "Veal|Kalbfleisch|empty"
            ],
            "Ingredients & Spices|Zutaten & Gewürze": [
                "Almonds|Mandeln|empty",
                "BBQ sauce|BBQ-Sauce|empty",
                "Baking powder|Backpulver|empty",
                "Balsamic vinegar|Balsamico|empty",
                "Beans|Bohnen|bohne",
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
                "Ketchup|Ketchup|ketchup",
                "Lentils|Linsen|empty",
                "Maple syrup|Ahornsirup|empty",
                "Mashed potatoes|Stocki|empty",
                "Mayonnaise|Mayonnaise|mayo",
                "Mint|Pfefferminze|empty",
                "Mustard|Senf|empty",
                "Nuts|Nüsse|empty",
                "Oil|Öl|oel",
                "Olive oil|Olivenöl|empty",
                "Oregano|Oregano|empty",
                "Paprika|Paprika|empty",
                "Pasta sauce|Tomatensauce|empty",
                "Parsley|Petersilie|empty",
                "Peanut butter|Erdnussbutter|empty",
                "Pepper|Pfeffer|empty",
                "Pickle|Salzgurken|salzgurken",
                "Pine nuts|Pinienkerne|empty",
                "Rosemary|Rosemarin|empty",
                "Sage|Salbei|empty",
                "Salad dressing|Salatsauce|empty",
                "Salt|Salz|empty",
                "Soy sauce|Sojasauce|empty",
                "Stock|Vorräte|empty",
                "Sugar|Zucker|zucker",
                "Thyme|Thymian|empty",
                "Tomato puree|Tomatenpürree|empty",
                "Vanilla sugar|Vanillezucker|empty",
                "Vinegar|Essig|empty",
                "Walnuts|Walnüsse|empty",
                "Yeast|Hefe|empty"
            ],
            "Frozen & Convenience|Fertig- & Tiefkühlprodukte": [
                "Baked beans|Weisse Bohnen|empty",
                "Burritos|Burritos|empty",
                "Chicken wings|Chicken wings|empty",
                "Chinese food|China-food|empty",
                "Chips|Chips|empty",
                "Dumplings|Knödel|empty",
                "Fish fingers|Fischstäbli|empty",
                "Frozen vegetables|Gemüse tiefgeroren|empty",
                "Ice cream|Glace|glace",
                "Lasagne|Lasagne|empty",
                "French Fries|Pommes Frites|pommesfrites",
                "Pizza|Pizza|waehe",
                "Ravioli|Ravioli|empty",
                "Tortelloni|Tortelloni|empty"
            ],
            "Grain Products|Getreideprodukte": [
                "Basmati rice|Basmatireis|reis",
                "Cereal|Frühstücksflocken|empty",
                "Chickpeas|Kichererbsen|empty",
                "Corn flakes|Corn Flakes|empty",
                "Couscous|Couscous|empty",
                "Ebly|Ebly|getreide",
                "Flour|Mehl|empty",
                "Muesli|Müesli|empty",
                "Noodles|Nudeln|empty",
                "Oatmeal|Haferflocken|haferflocken",
                "Pasta|Pasta|empty",
                "Penne|Penne|empty",
                "Rice|Reis|reis",
                "Risotto rice|Risottoreis|reis",
                "Semolina|Griess|empty",
                "Spaghetti|Spaghetti|empty",
                "Tofu|Tofu|empty"
            ],
            "Snacks & Sweets|Snacks & Süsses": [
                "Biscuits|Biscuits|guetzli",
                "Cake|Cake|empty",
                "Chewing gum|Kaugummi|empty",
                "Chocolate|Schokolade|schokolade",
                "Christmas cookies|Weihnachtsguetsli|guetzli",
                "Crackers|Crackers|empty",
                "Crisps|Chips|empty",
                "Custard|Creme|empty",
                "Dessert|Dessert|empty",
                "Donuts|Donuts|donut",
                "Dried fruits|Dörrfrüchte|empty",
                "Gingerbread|Lebkuchen|empty",
                "Honey|Honig|honig",
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
            "Beverage & Tobacco|Getränke & Tabak": [
                "Ale|Ale|empty",
                "Apple juice|Apfelsaft|empty",
                "Beer|Bier|bier",
                "Beverages|Getränke|empty",
                "Bottled water|Mineralwasser|empty",
                "Champagne|Champagner|empty",
                "Cider|Most|empty",
                "Cigarettes|Zigaretten|empty",
                "Coffee|Kaffee|kaffee",
                "Cola|Cola|empty",
                "Diet Cola|Cola light|empty",
                "Diet soda|Süssgetränke light|empty",
                "Energy drink|Energy drink|empty",
                "Fruit juice|Fruchtsaft|empty",
                "Gin|Gin|gin",
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
                "Tea|Tee|tee",
                "Tonic water|Tonic|empty",
                "Vodka|Wodka|empty",
                "Whisky|Whisky|empty",
                "White wine|Weisswein|empty"
            ],
            "Household & Health|Haushalt & Gesundheit": [
                "Aluminium foil|Aluminiumfolie|empty",
                "Baby food|Babynahrung|empty",
                "Band aid|Heftpflaster|heftpflaster",
                "Bathroom cleaner|Badreiniger|empty",
                "Batteries|Batterien|empty",
                "Body lotion|Body lotion|empty",
                "Candles|Kerzen|kerze",
                "Charcoal|Holzkohle|empty",
                "Cleaning supplies|Reinigungsmittel|empty",
                "Cling film|Frischhaltefolie|empty",
                "Conditioner|Haar-Spülung|empty",
                "Cotton pads|Wattebäusche|empty",
                "Cotton swabs|Wattestäbchen|empty",
                "Dental floss|Zahnseide|empty",
                "Deodorant|Deo|deo",
                "Dishwater salt|Regeneriersalz|empty",
                "Dishwater tabs|Spülmaschinen-Pulver|empty",
                "Fabric softener|Gewebeveredler|empty",
                "Face cream|Gesichtscreme|handcreme",
                "Facial tissues|Gesischtspads|empty",
                "Flowers|Blumen|blume",
                "Gift|Geschenk|geschenk",
                "Glass cleaner|Glasreiniger|empty",
                "Glue|Leim|leim",
                "Hair brush|Haarbürzte|haarbuerste",
                "Hair gel|Haargel|empty",
                "Hair spray|Haarspray|empty",
                "Hand cream|Handcreme|handcreme",
                "Insect repellent|Antibrumm|empty",
                "Laundry detergent|Waschmittel|empty",
                "Light bulb|Leuchtmittel|gluehbirne",
                "Lipstick|Lippenstift|lippenstift",
                "Matches|Streichhölzer|streichhoelzer",
                "Makeup remover|Makeup-Entferner|empty",
                "Mouthwash|Mundspülung|empty",
                "Nail polish|Nagellack|empty",
                "Nail polish remove|Nagellackentferner|empty",
                "Napkins|Papierservicetten|empty",
                "Nappies|Windeln|empty",
                "Painkiller|Schmerzmittel|medis",
                "Paper towels|Haushaltspapier|empty",
                "Pen|Schreibzeug|bleistift",
                "Perfume|Parfum|parfum",
                "Razor|Rasierer|empty",
                "Razor blades|Rasierklingen|empty",
                "Shampoo|Shampoo|empty",
                "Shaving cream|Rasierschaum|empty",
                "Shower gel|Duschgel|empty",
                "Soap|Seife|fluessigseife",
                "Sponge|Schwamm|empty",
                "Sunscreen|Sonnenschutz|sonnenschutz",
                "Tampons|Tampons|empty",
                "Tissues|Kleenex|empty",
                "Toilet cleaner|WC-Reiniger|empty",
                "Toilet paper|WC-Papier|wcpapier",
                "Tootbrush|Zahnbürste|empty",
                "Toothpaste|Zahnpasta|empty",
                "Umbrella|Regenschirm|regenschirm",
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

        this._createService.createFirebaseCatalogx(catalog);
    }
}