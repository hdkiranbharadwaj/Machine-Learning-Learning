var answer  ;
var score = 0;
var backgroundArray = [];
function nextQuestion() {
    const n1=Math.floor(Math.random()*5);
    const n2=Math.ceil(Math.random()*5);
    document.getElementById('n1').innerHTML = n1;
    document.getElementById('n2').innerHTML = n2;
    answer = n1+n2;
    
}

function checkAnswer(){
    const prediction = predictImage();
    console.log(`answer ${answer}, prediction ${prediction}`);
    if(prediction==answer)
    {
        score++;
        console.log('Correct!! Score:'+score);
        if(score<=6){
        backgroundArray.push(`url('images/background${(score)}.svg')`);
        document.body.style.backgroundImage = backgroundArray;}else{
            alert('WELL DONE!! Congratulations!! \n Play again?');
            score = 0;
            backgroundArray=[];
            document.body.style.backgroundImage = backgroundArray;
        }
    }else{
        score=score>0?score-1:0;
        alert('Check Your Math!! \nHint: Try Drawing Beautifully As You Are ;)');
        setTimeout(function(){
            backgroundArray.pop();
            document.body.style.backgroundImage = backgroundArray;
        },1000);
        console.log('Wrong!!! Score:'+score);
    }
}