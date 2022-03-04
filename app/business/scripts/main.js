
//overall budget module
var gameController = (function(){
    
    var Qualification = function(id, name, value, description, cost) {
        this.id = id;
        this.type = 'act';
        this.id = this.id +'-'+ this.type;
        this.name = name;
        this.value = value;
        this.description = description;
        this.cost = cost;
    };
    var Investment = function(id, name, value, description, cost) {
        this.id = id;
        this.type = 'pas';
        this.id = this.id +'-'+ this.type;
        this.name = name;
        this.value = value;
        this.description = description;
        this.cost = cost;
    };
    
    
   
    var data = {
            act : 1,
            pas : 0,
            total : 0,
            isPasSet : false,
        incomeData: {
            quals : [

                new Qualification(0,'Time Management', 1, 'Grows up your active income by 1 for every click', 10),

                new Qualification(1,'Sales Course', 3, 'Grows up your active income by 3 for every click', 20),
                
                new Qualification(2,'Marketing classes', 20, 'Grows up your active income by 20 for every click', 100)
            ],

            invs : [
                new Investment(0,'Manual Labourer', 1, 'Gains your passive income by 1 every 2 seconds', 10),

                new Investment(1,'Marketing classes', 3, 'Gains your passive income by 3 every 2 seconds', 20),
                
                new Investment(1,'Team management', 7, 'Gains your passive income by 7 every 2 seconds', 100)
            ]
        }
    };
    
    var takeTypeOfId = function(id) {
        var splittedId, type;
        id = id.toString();
        splittedId = id.split('-');
        type = splittedId[splittedId.length -1];
        return type;
        
    }
    
    var takeNoOfId = function(id) {
        var splittedId, type;
        id = id.toString();
        splittedId = id.split('-');
        id = splittedId[splittedId.length -2];
        return id;
        
    }
    
    
    
    return {
        
        getBudgetData : function() {
            return data;
        },
        
        
        buy : function(transactionData) {
            var id, type, cost, message;
            id = takeNoOfId(transactionData);
            type = takeTypeOfId(transactionData);
            
            
            if(type === 'act'){
                cost = data.incomeData.quals[id].cost;
                message = 'You dont have enough money!\nCost : ' + cost+'$';
               if(data.total >= cost){
                   data.total -= cost;
                   data.act += data.incomeData.quals[id].value;
               }else {
                   alert(message);
               }
                

            }else if(type === 'pas'){
                cost = data.incomeData.invs[id].cost;
                message = 'You dont have enough money!\nCost : ' + cost +'$';
                if(data.total >= cost){
                   data.total -= cost;
                    data.pas += data.incomeData.invs[id].value;
               }else {
                   alert(message);
               }
            }
        },
        
    };
    
    
})();


/*-------------------------------------------------------------------------------------------*/



//UI module
var UIController = (function() {
    
    var DOMStrings = {
        
        workBtn : '#work-btn',
        curBudget : '#current-budget',
        curActInc: '#current-active-income',
        curPasInc: '#current-passive-income',
        //qual data
        actIncContainer : '.quals-container',
        pasIncContainer : '.invs-container',
        incomeContainer: '#income-container',
        logOutBtn : '#logout-btn'
        
    };
    var displayIncomeSource = function (obj, type) {
            var newHtml;
                newHtml = '<div class="card"><div class="card-block text-center"><div class="btn btn-s btn-info" id="'+obj.id+'">'+obj.name+'</div><p class="text-center">Cost: '+obj.cost+'</p><div class="jumbotron jumbotron-fluid"><p class="text-center">'+obj.description+'</p></div></div></div>';
            if ( obj.type === 'act'){
                document.querySelector(DOMStrings.actIncContainer).insertAdjacentHTML('beforeend', newHtml);
            }else {
                document.querySelector(DOMStrings.pasIncContainer).insertAdjacentHTML('beforeend', newHtml);
            }  
        };
    // some code
    return {
        
        getDOMStrings : function() {
            return DOMStrings;
        },
        displayBudget : function(budget){
            document.querySelector(DOMStrings.curBudget).textContent = budget;
        },
        displayActInc : function (act) {
            document.querySelector(DOMStrings.curActInc).textContent = act;
        },
        displayPasInc : function (pas) {
            document.querySelector(DOMStrings.curPasInc).textContent = pas;
        },
        displayAllIncomeSources: function (arr){
            for(var i = 0; i < arr.length; i++){
                displayIncomeSource(arr[i]);
            }
        }
        
    }
    
    
})();




/*-------------------------------------------------------------------------------------------*/




var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        
        // WORK active btns
        document.querySelector(DOM.workBtn).addEventListener('click', work);
        // space/enter trigger
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 32 || e.which === 32 || e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                work();
            }
        
        });
        
        document.querySelector(DOM.incomeContainer).addEventListener('click', buyTrigger);
//       
        
    };
    
    //dom strings
    var DOM = UICtrl.getDOMStrings();
    
    
    /*TO CHANGE*/
    var budgetData = gameController.getBudgetData();
    
    
   var total_income = budgetData.total;
   var active_income = budgetData.act;
   var passive_income = budgetData.pas;
    console.log('total '+  total_income);
    console.log('active '+  active_income);
    console.log('passive '+  passive_income);
  
    
    var updateData = function(amount) {

        UICtrl.displayBudget(budgetData.total);
    };
     var work = function(){
        budgetData.total += budgetData.act;
         console.log(budgetData);
         updateData();
    };
       function gainBudget(){
        budgetData.total += budgetData.pas;
           console.log(budgetData);
           updateData();
    }
    
    function Interval(fn, time) {
        var timer = false;
        this.start = function () {
            if (!this.isRunning())
                timer = setInterval(fn, time);
        };
        this.stop = function () {
            clearInterval(timer);
            timer = false;
        };
        this.isRunning = function () {
            return timer !== false;
        };
    }

    var i = new Interval(gainBudget, 2000);
    
   
    var buyTrigger = function(e){ 
        budgetCtrl.buy(e.target.id);
        updateData();
        UICtrl.displayActInc(budgetData.act);
        UICtrl.displayPasInc(budgetData.pas);
        
        startPasInc();
        
    }
    var startPasInc = function(){
        var pasCheck = false;
        if(budgetData.pas > 0){
            if(pasCheck === false){
                i.start();
                pasCheck = true;
            }else{
                return;
            }
        }
    }
    
    
   
 
    return {
        init : function(){
                console.log('Init confirmed.');
   
                startPasInc();
                updateData();
                //displaying setup
                 UICtrl.displayActInc(budgetData.act);
                 UICtrl.displayPasInc(budgetData.pas);

                //displaying income data
                 UICtrl.displayAllIncomeSources(budgetData.incomeData.quals)
                 UICtrl.displayAllIncomeSources(budgetData.incomeData.invs)
                 setupEventListeners();
            },
        
        };
        
    
})(gameController, UIController);


controller.init();
