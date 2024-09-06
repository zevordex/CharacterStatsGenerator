//Type = NUMBER || STRING
let StatsSettings = { // Default settings
    stats:[
        {name:"Сила",type:"NUMBER",maximum:100,minimum:0,variants:undefined},
        {name:"Инта",type:"NUMBER",maximum:100,minimum:0,variants:undefined},
        {name:"Ловкость",type:"NUMBER",maximum:100,minimum:0,variants:undefined},
        {name:"Test",type:"STRING",maximum:undefined,minimum:undefined,variants:["Test 1","Test 2","Test 3"]}

    ]
}
let values = [];

let toEdit = {variants:0};
function closeModal(){
    document.querySelector('.modal-container').classList.add('hidden');
}
function rebuildStats(){
    let sContainer = document.querySelector('.stats-container');
    let htmlString = ``;
    let c = 0;
    StatsSettings.stats.forEach(stat=>{
        htmlString+=`<div class="stat" i="${c}"><button title="Edit" class="stat-edit" i="${c}">E</button><button title="Reroll" class="stat-reroll"  i="${c}">R</button><p title="${stat.name}">${stat.name}</p>`
        if (stat.type == "NUMBER"){
            let value = 0;
            if (values[c]){
                value = values[c];
            }else{
                values[c] = 0;
            }
            htmlString+=`<input type="number" value=${value} class="stat-input" i="${c}">`
        }
        if (stat.type == "STRING"){
            htmlString+=`<select class="stat-input" i="${c}">`
            if (stat.variants){
                if (stat.variants.length == 0){
                    htmlString+=`<option>Не настроено</option></select>`
                }else{
                    stat.variants.forEach(variant=>{
                        htmlString+=`<option>${variant}</option>`;
                    })
                    htmlString+=`</select>`;
                    values[c] = stat.variants[0];
                }
            }else{
                htmlString+=`<option>Не настроено</option></select>`
                values[c] = "Не настроено";
            }
        }
        c++;
        htmlString+=`</div>`
    })
    htmlString+=`<button id="stat-add">Добавить</button>`
    sContainer.innerHTML = htmlString;
}

document.addEventListener('DOMContentLoaded',ev=>{rebuildStats()})
document.addEventListener('click',ev=>{
    if (ev.target.id == "stat-add"){
        document.querySelector('.modal-container').classList.remove('hidden');
        toEdit.id = undefined;
        toEdit.variants = 0;
        document.querySelector('#modal-edit-submit').textContent = "Добавить";
        document.querySelector('#modal-edit-name').value = "Характеристика";
        document.querySelector('.edit-modal-string-list').innerHTML = ``;
        document.querySelector('#modal-edit-type').value = "NUMBER";
        document.querySelector('#modal-edit-maximum').value = 1;
        document.querySelector('#modal-edit-minimum').value = 0;
        changeModalViewByType("NUMBER");
        return;
    }
    if (ev.target.classList.contains("stat-edit")){
        document.querySelector('.modal-container').classList.remove('hidden');
        toEdit.id = parseInt(ev.target.getAttribute('i'));
        document.querySelector('#modal-edit-submit').textContent = "Изменить"
        document.querySelector('#modal-edit-name').value = StatsSettings.stats[toEdit.id].name;
        let type = StatsSettings.stats[toEdit.id].type;
        document.querySelector('#modal-edit-type').value = type;
        changeModalViewByType(type);
        if (type == "STRING"){
            document.querySelector('#modal-edit-minimum').value = "";
            document.querySelector('#modal-edit-maximum').value = "";
            let miscString = ``;
            let c = 0;
            StatsSettings.stats[toEdit.id].variants.forEach(variant=>{
                miscString+=`<span><input class="string-variant"value="${variant}" i="${c}"><button class="delete-string-variant" i="${c}">X</button></span>`;
                document.querySelector('.edit-modal-string-list').innerHTML = miscString;
                c++;
            })
            toEdit.variants = c;
        }
        if (type == "NUMBER"){
            console.log(StatsSettings.stats[toEdit.id])
            document.querySelector('#modal-edit-minimum').value = StatsSettings.stats[toEdit.id].minimum;
            document.querySelector('#modal-edit-maximum').value = StatsSettings.stats[toEdit.id].maximum;
        }
        return;
    }
    if (ev.target.classList.contains("stat-reroll")){
        id = parseInt(ev.target.getAttribute('i'));
        rerollStat(id);
    }
    if (ev.target.classList.contains('modal-container')){
        closeModal();
    }
})

//Edit-modal
function changeModalViewByType(type){
    if (type == "STRING"){
        document.querySelector('.edit-modal-string-list').classList.remove('hidden');
        document.querySelector('#modal-edit-maximum-span').classList.add('hidden');
        document.querySelector('#modal-edit-minimum-span').classList.add('hidden');
        document.querySelector('#modal-edit-add-string').classList.remove('hidden');
    }
    if (type == "NUMBER"){
        document.querySelector('.edit-modal-string-list').classList.add('hidden');
        document.querySelector('#modal-edit-maximum-span').classList.remove('hidden');
        document.querySelector('#modal-edit-minimum-span').classList.remove('hidden');
        document.querySelector('#modal-edit-add-string').classList.add('hidden');
    }
}
document.querySelector('#modal-edit-type').addEventListener('change',ev=>{
    changeModalViewByType(ev.target.value);
})
document.querySelector('#modal-edit-add-string').addEventListener('click',ev=>{
    let c = toEdit.variants;
    toEdit.variants = c+1;
    let str = `<span><input class="string-variant"value="Пусто" i="${c}"><button class="delete-string-variant" i="${c}">X</button></span>`;
    document.querySelector('.edit-modal-string-list').insertAdjacentHTML('beforeend',str);
})
document.querySelector('#modal-edit-submit').addEventListener('click',ev=>{
    let name = document.querySelector('#modal-edit-name').value;
    let type = document.querySelector('#modal-edit-type').value;
    if (type == "STRING"){
        let variants = [];
        for (let i =0; i < toEdit.variants; i++){
            variants[i] = document.querySelector(`.string-variant[i="${i}"]`).value;
        }
        if (toEdit.id == undefined){
            StatsSettings.stats.push({name,type,variants});
        }else{
            StatsSettings.stats[toEdit.id] = {name,type,variants};
        }
    }
    if (type == "NUMBER"){
        let maximum = parseFloat(document.querySelector('#modal-edit-maximum').value);
        let minimum = parseFloat(document.querySelector('#modal-edit-minimum').value);
        if (toEdit.id == undefined){
            StatsSettings.stats.push({name,type,maximum,minimum});
        }else{
            StatsSettings.stats[toEdit.id] = {name,type,maximum,minimum};
        }
    }
    rebuildStats();
    closeModal();
})
function rnd(min,max){return Math.floor(Math.random()*(max-min+1)+min)}
function rerollStats(){
    for (let i = 0; i < StatsSettings.stats.length; i++){
        rerollStat(i)
    }
}
function rerollStat(id){
    let stat = StatsSettings.stats[id];
    if (stat.type == "NUMBER"){
        let value = 0;
        let min = parseFloat(stat.minimum);
        let max = parseFloat(stat.maximum)
        if (!isNaN(min) && !isNaN(max)){
            value = rnd(min,max);
            values[id] = value;
        }else{
            value = rnd(0,2147000000);
        }
        document.querySelector(`.stat-input[i="${id}"]`).value = value;
    }
    if (stat.type == "STRING"){
        let min = parseFloat(0);
        let max = parseFloat(stat.variants.length-1);
        let value = stat.variants[rnd(min,max)];
        document.querySelector(`.stat-input[i="${id}"]`).value = value;
    }
}
document.querySelector('#load-json').addEventListener('click',ev=>{
    window.API.send("DATA_TO_MAIN",{type:"LOAD_JSON"});
})
document.querySelector('#save-json').addEventListener('click',ev=>{
    window.API.send("DATA_TO_MAIN",{type:"SAVE_JSON",stats:StatsSettings.stats,values});
})
document.querySelector('#save-template').addEventListener('click',ev=>{
    window.API.send("DATA_TO_MAIN",{type:"SAVE_TEMPLATE",stats:StatsSettings.stats});
})
document.querySelector('#load-template').addEventListener('click',ev=>{
    window.API.send("DATA_TO_MAIN",{type:"LOAD_TEMPLATE"});
})
document.querySelector('#save-txt').addEventListener('click',ev=>{
    window.API.send("DATA_TO_MAIN",{type:"SAVE_TXT",stats:StatsSettings.stats,values});
})
document.querySelector('#all-reroll').addEventListener('click',ev=>{
    rerollStats();
})
window.API.receive('DATA_FROM_MAIN',(args)=>{
    if (args.type == "LOAD_JSON"){
        if (!args.json.values){
            return alert(`Вместо сохранения был загружен файл шаблон!`)
        }
        StatsSettings.stats = args.json.stats;
        values = args.json.values;
        rebuildStats();
    }
    if (args.type == "LOAD_TEMPLATE"){
        StatsSettings.stats = args.json.stats;
        rebuildStats();
    }
})