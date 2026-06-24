// =================================
// MONEY EMPIRE GAME
// =================================

// بيانات اللعبة

let game = {
    balance: 10000,
    income: 0,
    loan: 0,
    day: 1,
    multiplier: 1,
    totalProfit: 0,
    highestBalance: 10000,

    projects: [],
    employees: {
        beginner: 0,
        manager: 0,
        executive: 0
    }
};

// =================================
// ELEMENTS
// =================================

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const levelEl = document.getElementById("level");
const dayEl = document.getElementById("day");
const loanEl = document.getElementById("loan");
const assetsEl = document.getElementById("assets");
const salaryCostEl = document.getElementById("salaryCost");
const eventsEl = document.getElementById("events");
const ownedProjectsEl = document.getElementById("ownedProjects");

// =================================
// DATABASE
// =================================

const projectsDB = [
{ name:"مقهى", price:5000, profit:100 },
{ name:"مطعم", price:15000, profit:300 },
{ name:"سوبر ماركت", price:50000, profit:1200 },
{ name:"محطة وقود", price:100000, profit:2500 },
{ name:"عقار", price:300000, profit:7000 },
{ name:"شركة مقاولات", price:750000, profit:15000 },
{ name:"شركة نقل", price:1500000, profit:30000 },
{ name:"مول تجاري", price:3000000, profit:60000 },
{ name:"مستشفى خاص", price:5000000, profit:100000 },
{ name:"مصنع", price:10000000, profit:200000 },
{ name:"جامعة خاصة", price:15000000, profit:300000 },
{ name:"فندق فاخر", price:25000000, profit:500000 },
{ name:"بنك استثماري", price:50000000, profit:1000000 },
{ name:"شركة اتصالات", price:100000000, profit:2500000 },
{ name:"شركة شحن بحري", price:200000000, profit:5000000 },
{ name:"نادي كرة قدم", price:300000000, profit:7000000 },
{ name:"شركة طيران", price:500000000, profit:12000000 },
{ name:"شركة نفط", price:1000000000, profit:25000000 },
{ name:"ميناء تجاري", price:2500000000, profit:60000000 },
{ name:"شركة تقنية عالمية", price:5000000000, profit:150000000 }
];

// =================================
// SAVE
// =================================

function saveGame(){
    localStorage.setItem(
        "moneyEmpire",
        JSON.stringify(game)
    );
    localStorage.setItem(
        "stocks",
        JSON.stringify(stocks)
    );
}

function loadGame(){

    const savedStocks =
localStorage.getItem("stocks");

if(savedStocks){

    stocks =
    JSON.parse(savedStocks);

}

    const save =
    localStorage.getItem("moneyEmpire");

    if(save){

        game = JSON.parse(save);

    }

}

// =================================
// LEVEL
// =================================

function getLevel(){

    if(game.balance >= 1000000000)
        return "👑 أسطورة";

    if(game.balance >= 1000000)
        return "💎 ملياردير";

    if(game.balance >= 100000)
        return "🏢 رجل أعمال";

    if(game.balance >= 50000)
        return "📈 مستثمر";

    return "👶 مبتدئ";
}

// =================================
// ASSETS
// =================================

function getAssets(){

    let assets = game.balance;

    game.projects.forEach(project=>{

        assets +=
        project.count *
        project.profit *
        10;

    });

    stocks.forEach(stock=>{

        assets +=
        stock.price *
        stock.owned;

    });

    return Math.floor(assets);
}

// =================================
// SALARY
// =================================

function getSalary(){

    return (

        game.employees.beginner * 200 +

        game.employees.manager * 1000 +

        game.employees.executive * 5000

    );
}

// =================================
// PROJECT INCOME
// =================================

function getProjectsIncome(){

    let income = 0;

    game.projects.forEach(project=>{

        income +=
        project.count *
        project.profit;

    });

    return Math.floor(
        income * game.multiplier
    );
}

// =================================
// UPDATE UI
// =================================

function updateUI(){

    balanceEl.textContent =
    game.balance.toLocaleString();

    incomeEl.textContent =
    game.income.toLocaleString();

    loanEl.textContent =
    Math.floor(game.loan)
    .toLocaleString();

    dayEl.textContent =
    game.day;

    levelEl.textContent =
    getLevel();

    assetsEl.textContent =
    getAssets()
    .toLocaleString();

    salaryCostEl.textContent =
    getSalary()
    .toLocaleString();

    renderProjects();
checkAchievements();

checkMissions();

renderAchievements();

renderMissions();

updateStatistics();
    saveGame();
}

// =================================
// OWNED PROJECTS
// =================================

function renderProjects(){

    ownedProjectsEl.innerHTML = "";

    game.projects.forEach(project=>{

        const li =
        document.createElement("li");

        li.innerHTML = `
        🏢 ${project.name}
        <br>
        📦 العدد: ${project.count}
        <br>
        📈 الربح: ${project.profit}
        `;

        ownedProjectsEl.appendChild(li);

    });

}

// =================================
// BUY PROJECT
// =================================

function buyProject(name){

    const project =
    projectsDB.find(
        p => p.name === name
    );

    if(!project){
        return;
    }

    if(game.balance < project.price){

        eventsEl.textContent =
        "❌ الرصيد غير كاف";

        return;
    }

    game.balance -= project.price;

    const owned =
    game.projects.find(
        p => p.name === name
    );

    if(owned){

        owned.count++;

    }else{

        game.projects.push({

            name:project.name,
            profit:project.profit,
            count:1

        });

    }

    eventsEl.textContent =
    `🏢 تم شراء ${name}`;

    updateUI();
}

// =================================
// CONNECT BUTTONS
// =================================

document
.querySelectorAll(".card")
.forEach(card=>{

    const title =
    card.querySelector("h3")
    .textContent
    .replace(/[^\u0600-\u06FF\s]/g,"")
    .trim();

    card.querySelector("button")
    .onclick =
    ()=> buyProject(title);

});

// =================================
// GAME LOOP
// =================================

setInterval(()=>{

    const income =
    getProjectsIncome() +
    getEmployeesIncome();

    game.income = income;

    game.balance += income;

    game.balance -= getSalary();

    if(game.loan > 0){

        game.loan +=
        game.loan * 0.01;

    }

    game.totalProfit += income;

    if(
        game.balance >
        game.highestBalance
    ){
        game.highestBalance =
        game.balance;
    }

    game.day++;

    updateStocks();

    renderStocks();

    updateUI();

},5000);
// part 2


// =================================
// TOAST
// =================================

function toast(message){

    const toast =
    document.getElementById("toast");

    if(!toast) return;

    toast.textContent = message;
    toast.style.opacity = "1";

    setTimeout(()=>{

        toast.style.opacity = "0";

    },2500);

}

// =================================
// EMPLOYEES
// =================================

const employeesDB = {

    beginner:{
        name:"موظف مبتدئ",
        cost:5000,
        salary:200,
        profit:400
    },

    manager:{
        name:"مدير",
        cost:25000,
        salary:1000,
        profit:2000
    },

    executive:{
        name:"مدير تنفيذي",
        cost:100000,
        salary:5000,
        profit:10000
    },

    marketer:{
        name:"خبير تسويق",
        cost:500000,
        salary:10000,
        profit:25000
    },

    analyst:{
        name:"محلل مالي",
        cost:1000000,
        salary:25000,
        profit:50000
    },

    regional:{
        name:"مدير إقليمي",
        cost:5000000,
        salary:100000,
        profit:250000
    },

    globalCEO:{
        name:"رئيس تنفيذي عالمي",
        cost:25000000,
        salary:500000,
        profit:1000000
    },

    aiEngineer:{
        name:"مهندس ذكاء اصطناعي",
        cost:100000000,
        salary:2000000,
        profit:5000000
    },

    investor:{
        name:"مستشار استثماري",
        cost:250000000,
        salary:5000000,
        profit:12000000
    },

    empireManager:{
        name:"مدير إمبراطورية",
        cost:1000000000,
        salary:15000000,
        profit:50000000
    }

};
// =================================
// EMPLOYEE INCOME
// =================================

function getEmployeesIncome(){

    return (

        game.employees.beginner *
        employeesDB.beginner.profit +

        game.employees.manager *
        employeesDB.manager.profit +

        game.employees.executive *
        employeesDB.executive.profit

    );

}

// =================================
// HIRE EMPLOYEE
// =================================

function hireEmployee(type){

    const employee =
    employeesDB[type];

    if(game.balance < employee.cost){

        toast("❌ الرصيد غير كاف");
        return;

    }

    game.balance -= employee.cost;

    game.employees[type]++;

    eventsEl.textContent =
    `👷 تم توظيف ${employee.name}`;

    updateUI();

}

// =================================
// CONNECT EMPLOYEE BUTTONS
// =================================

const employeeButtons =
document.querySelectorAll(
".employee button"
);

if(employeeButtons.length >= 3){

    employeeButtons[0].onclick =
    ()=> hireEmployee("beginner");

    employeeButtons[1].onclick =
    ()=> hireEmployee("manager");

    employeeButtons[2].onclick =
    ()=> hireEmployee("executive");

}

// =================================
// BANK
// =================================

function takeLoan(){

    if(game.loan > 0){

        toast("❌ لديك قرض بالفعل");
        return;

    }

    game.loan = 10000;
    game.balance += 10000;

    eventsEl.textContent =
    "🏦 تم أخذ قرض 10,000";

    updateUI();

}

function payLoan(){

    if(game.loan <= 0){

        toast("❌ لا يوجد قرض");
        return;

    }

    if(game.balance < game.loan){

        toast("❌ الرصيد غير كاف");
        return;

    }

    game.balance -= game.loan;
    game.loan = 0;

    eventsEl.textContent =
    "✅ تم سداد القرض";

    updateUI();

}

// =================================
// CONNECT BANK BUTTONS
// =================================

const bankButtons =
document.querySelectorAll(
".bank button"
);

if(bankButtons.length >= 2){

    bankButtons[0].onclick =
    takeLoan;

    bankButtons[1].onclick =
    payLoan;

}


// part 3


// =================================
// UPGRADES
// =================================

const upgrades = [

{
    name:"إعلانات تسويقية",
    price:50000,
    bonus:0.10,
    bought:false
},

{
    name:"مدير محترف",
    price:250000,
    bonus:0.25,
    bought:false
},

{
    name:"أتمتة كاملة",
    price:1000000,
    bonus:0.50,
    bought:false
},

{
    name:"توسع عالمي",
    price:10000000,
    bonus:0.75,
    bought:false
},

{
    name:"ذكاء اصطناعي متطور",
    price:100000000,
    bonus:1.00,
    bought:false
}

];
// =================================
// BUY UPGRADE
// =================================

function buyUpgrade(index){

    const upgrade =
    upgrades[index];

    if(upgrade.bought){

        toast("تم شراء الترقية مسبقاً");
        return;

    }

    if(game.balance < upgrade.price){

        toast("❌ الرصيد غير كاف");
        return;

    }

    game.balance -= upgrade.price;

    game.multiplier +=
    upgrade.bonus;

    upgrade.bought = true;

    eventsEl.textContent =
    `⚡ تم شراء ${upgrade.name}`;

    updateUI();

}

// =================================
// CONNECT UPGRADE BUTTONS
// =================================

const upgradeButtons =
document.querySelectorAll(
".upgrade button"
);

upgradeButtons.forEach(
(button,index)=>{

    button.onclick =
    ()=> buyUpgrade(index);

});


// part 4


// =================================
// STOCK MARKET
// =================================

let stocks = [

{
    name:"⚡ الطاقة",
    price:100,
    owned:0
},

{
    name:"💻 التكنولوجيا",
    price:500,
    owned:0
},

{
    name:"🏢 العقارات",
    price:300,
    owned:0
},

{
    name:"🏦 البنوك",
    price:800,
    owned:0
},

{
    name:"🛢 النفط",
    price:1200,
    owned:0
},

{
    name:"🚗 السيارات",
    price:700,
    owned:0
},

{
    name:"✈ الطيران",
    price:1500,
    owned:0
},

{
    name:"📡 الاتصالات",
    price:900,
    owned:0
},

{
    name:"🏥 الرعاية الصحية",
    price:1100,
    owned:0
},

{
    name:"🛒 التجارة",
    price:600,
    owned:0
}

];

// part 5


function buyStock(index){

    const stock =
    stocks[index];

    if(game.balance < stock.price){

        toast("❌ الرصيد غير كاف");
        return;

    }

    game.balance -= stock.price;

    stock.owned++;

    toast(
        `📈 اشتريت سهم ${stock.name}`
    );

    renderStocks();

    updateUI();

}   

function sellStock(index){

    const stock =
    stocks[index];

    if(stock.owned <= 0){

        toast("❌ لا تملك أسهماً");
        return;

    }

    stock.owned--;

    game.balance += stock.price;

    toast(
        `💰 بعت سهم ${stock.name}`
    );

    renderStocks();

    updateUI();

}

function renderStocks(){

    const cards =
    document.querySelectorAll(".stock");

    cards.forEach((card,index)=>{

        const stock =
        stocks[index];

        card.innerHTML = `

        <h3>${stock.name}</h3>

        <p>
        السعر:
        ${Math.floor(stock.price)}
        </p>

        <p>
        المملوك:
        ${stock.owned}
        </p>

        <button
        onclick="buyStock(${index})">
        شراء
        </button>

        <button
        onclick="sellStock(${index})">
        بيع
        </button>

        `;

    });

}

function updateStocks(){

    stocks.forEach(stock=>{

        let change =

        Math.random() * 20 - 10;

        stock.price += change;

        if(stock.price < 10){

            stock.price = 10;

        }

    });

}
updateStocks();

renderStocks();

const income =
getProjectsIncome() +
getEmployeesIncome();

// ==========================
// ACHIEVEMENTS
// ==========================

const achievements = [

"🏆 أول مشروع",
"🏆 أول موظف",
"🏆 امتلك 5 مشاريع",
"🏆 امتلك 10 مشاريع",
"🏆 امتلك 20 مشروع",

"💰 امتلك 100 ألف",
"💰 امتلك مليون",
"💰 امتلك 100 مليون",
"💰 امتلك مليار",

"👷 وظف 10 موظفين",
"👷 وظف 50 موظف",

"📈 امتلك 100 سهم",

"👑 أصبح مليارديراً"

];

let unlockedAchievements = [];

function renderAchievements(){

    const list =
    document.getElementById(
        "achievementList"
    );

    if(!list) return;

    list.innerHTML = "";

    achievements.forEach(a=>{

        const li =
        document.createElement("li");

        li.textContent =
        unlockedAchievements.includes(a)
        ? `✅ ${a}`
        : `🔒 ${a}`;

        list.appendChild(li);

    });

}

function rewardAchievement(amount){

    game.balance += amount;

    toast(
        `🎉 مكافأة إنجاز: ${amount.toLocaleString()}`
    );

}

function checkAchievements(){

    const employeesCount =

    game.employees.beginner +
    game.employees.manager +
    game.employees.executive +
    (game.employees.marketer || 0) +
    (game.employees.analyst || 0) +
    (game.employees.regional || 0) +
    (game.employees.globalCEO || 0) +
    (game.employees.aiEngineer || 0) +
    (game.employees.investor || 0) +
    (game.employees.empireManager || 0);

    if(
        game.projects.length >= 1 &&
        !unlockedAchievements.includes(
            "🏆 أول مشروع"
        )
    ){

        unlockedAchievements.push(
            "🏆 أول مشروع"
        );

        rewardAchievement(10000);

    }

    if(
        employeesCount >= 1 &&
        !unlockedAchievements.includes(
            "🏆 أول موظف"
        )
    ){

        unlockedAchievements.push(
            "🏆 أول موظف"
        );

        rewardAchievement(25000);

    }

    if(
        game.projects.length >= 5 &&
        !unlockedAchievements.includes(
            "🏆 امتلك 5 مشاريع"
        )
    ){

        unlockedAchievements.push(
            "🏆 امتلك 5 مشاريع"
        );

        rewardAchievement(100000);

    }

    if(
        game.projects.length >= 10 &&
        !unlockedAchievements.includes(
            "🏆 امتلك 10 مشاريع"
        )
    ){

        unlockedAchievements.push(
            "🏆 امتلك 10 مشاريع"
        );

        rewardAchievement(500000);

    }

    if(
        game.projects.length >= 20 &&
        !unlockedAchievements.includes(
            "🏆 امتلك 20 مشروع"
        )
    ){

        unlockedAchievements.push(
            "🏆 امتلك 20 مشروع"
        );

        rewardAchievement(5000000);

    }

    if(
        game.balance >= 100000 &&
        !unlockedAchievements.includes(
            "💰 امتلك 100 ألف"
        )
    ){

        unlockedAchievements.push(
            "💰 امتلك 100 ألف"
        );

        rewardAchievement(50000);

    }

    if(
        game.balance >= 1000000 &&
        !unlockedAchievements.includes(
            "💎 امتلك مليون"
        )
    ){

        unlockedAchievements.push(
            "💎 امتلك مليون"
        );

        rewardAchievement(500000);

    }

    if(
        game.balance >= 100000000 &&
        !unlockedAchievements.includes(
            "💰 امتلك 100 مليون"
        )
    ){

        unlockedAchievements.push(
            "💰 امتلك 100 مليون"
        );

        rewardAchievement(10000000);

    }

    if(
        game.balance >= 1000000000 &&
        !unlockedAchievements.includes(
            "👑 أصبح مليارديراً"
        )
    ){

        unlockedAchievements.push(
            "👑 أصبح مليارديراً"
        );

        rewardAchievement(100000000);

    }

    if(
        employeesCount >= 10 &&
        !unlockedAchievements.includes(
            "👷 وظف 10 موظفين"
        )
    ){

        unlockedAchievements.push(
            "👷 وظف 10 موظفين"
        );

        rewardAchievement(1000000);

    }

    if(
        employeesCount >= 50 &&
        !unlockedAchievements.includes(
            "👷 وظف 50 موظف"
        )
    ){

        unlockedAchievements.push(
            "👷 وظف 50 موظف"
        );

        rewardAchievement(10000000);

    }

}

const missions = [

{
    title:"امتلك أول مشروع",
    reward:10000,
    done:false
},

{
    title:"وظف أول موظف",
    reward:25000,
    done:false
},

{
    title:"امتلك 3 مشاريع",
    reward:100000,
    done:false
},

{
    title:"امتلك 5 مشاريع",
    reward:250000,
    done:false
},

{
    title:"امتلك 10 مشاريع",
    reward:1000000,
    done:false
},

{
    title:"امتلك 20 مشروع",
    reward:5000000,
    done:false
},

{
    title:"وظف 10 موظفين",
    reward:1000000,
    done:false
},

{
    title:"وظف 50 موظف",
    reward:10000000,
    done:false
},

{
    title:"امتلك 100 ألف",
    reward:50000,
    done:false
},

{
    title:"امتلك مليون",
    reward:500000,
    done:false
},

{
    title:"امتلك 100 مليون",
    reward:10000000,
    done:false
},

{
    title:"امتلك مليار",
    reward:100000000,
    done:false
}

];


function renderMissions(){

    const list =
    document.getElementById(
        "missionsList"
    );

    if(!list) return;

    list.innerHTML = "";

    missions.forEach(m=>{

        const li =
        document.createElement("li");

        li.innerHTML =

        m.done

        ?

        `✅ ${m.title}`

        :

        `🎯 ${m.title}
        <br>
        💰 ${m.reward}`;

        list.appendChild(li);

    });

}

function checkMissions(){

    const employeesCount =

    game.employees.beginner +
    game.employees.manager +
    game.employees.executive;

    if(
        game.projects.length >= 1 &&
        !missions[0].done
    ){

        missions[0].done = true;

        game.balance +=
        missions[0].reward;

    }

    if(
        employeesCount >= 1 &&
        !missions[1].done
    ){

        missions[1].done = true;

        game.balance +=
        missions[1].reward;

    }

    if(
        game.projects.length >= 3 &&
        !missions[2].done
    ){

        missions[2].done = true;

        game.balance +=
        missions[2].reward;

    }

}

function updateStatistics(){

    const stats =
    document.querySelectorAll(
        ".statistics p"
    );

    if(stats.length < 4) return;

    const employeesCount =

    game.employees.beginner +
    game.employees.manager +
    game.employees.executive;

    stats[0].textContent =
    `💰 إجمالي الأرباح: ${game.totalProfit.toLocaleString()}`;

    stats[1].textContent =
    `🏢 عدد المشاريع: ${game.projects.length}`;

    stats[2].textContent =
    `👷 عدد الموظفين: ${employeesCount}`;

    stats[3].textContent =
    `👑 أعلى رصيد: ${game.highestBalance.toLocaleString()}`;

}

// =================================
// START
// =================================

loadGame();

updateUI();
saveGame();
renderStocks();
renderAchievements();

renderMissions();

updateStatistics();

eventsEl.textContent =
"🚀 مرحباً بك في إمبراطورية المال";

function resetGame(){

    if(!confirm("هل أنت متأكد من إعادة ضبط اللعبة؟")){
        return;
    }

    localStorage.removeItem("moneyEmpire");
    localStorage.removeItem("stocks");

    location.reload();

}