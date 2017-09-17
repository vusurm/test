
class usersListClass {
    constructor(options) {
        this._users  = new Array();
        this.ulUsers  = null;

        this.createModal();
        this.loadUsers();
    }

    createElements(elements) {
        for (let i = 0; i < elements.length; i++) {
            let el = elements[i];
            let newEl = document.createElement(el[1]);
            if (el.length > 2 && el[2])
                newEl.className = el[2];
            if (el.length > 3 && el[3])
                newEl.innerHTML = el[3];
            this[el[0]] = newEl;
        }
    }
    
    appendElements(parentElement, elements) {
        for (let i = 0; i < elements.length; i++)
            parentElement.appendChild(elements[i]);
    }

    getLength() {
        return this._users.length;
    }

    createList() {
        this.ulUsers = document.createElement('ul');
        //console.log(this._users);
        
        for (let i = 0; i < this._users.length; i++) {
            let user = this._users[i];
            let newLi = document.createElement('li');
            newLi.id = i;
            newLi.onclick = onClickUser;
            newLi.innerHTML = '<div class="userColumn"><img src="' + user.picture.thumbnail + '"/></div>'  + user.name.title + ' ' + user.name.first + ' ' + user.name.last;
            this.ulUsers.appendChild(newLi);
        }
        document.body.appendChild(this.ulUsers);
    }

    loadUsers () {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture');
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;
        
            if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText);
            } else {
                usersList._users = JSON.parse(xhr.responseText).results.sort((a,b)=>{ return a.name.last > b.name.last ? 1 : -1; })
                usersList.createList();
            }
        }
    }

    ResortUsers(order) {
        if (order) //0 - ascending, 1 - descending
            this._users.sort((a,b)=>{ return a.name.last > b.name.last ? -1 : 1; });
        else
            this._users.sort((a,b)=>{ return a.name.last > b.name.last ? 1 : -1; })    

        for (let j = 0; j < this._users.length; j++) {
            let user = this._users[j];
            let currentLi = document.getElementById(j);
            currentLi.innerHTML = '<div class="userColumn"><img src="' + user.picture.thumbnail + '"/></div>'  + user.name.title + ' ' + user.name.first + ' ' + user.name.last;
        }
        //console.log("Sort order changed: " + order);
    }

    createModal() { //['toolbox', 'div', 'toolbox']
        this.createElements([ ['popupUser', 'div', 'modal'], ['popupContent', 'div', 'modalContent'], ['spanClose', 'div','close', '&times'],
        ['pic', 'img'], ['name', 'div'], ['street', 'div'], ['city', 'div'], ['state', 'div'],
        ['email', 'div'], ['phone', 'div'] ]);

        this.spanClose.onclick = function() {
            usersList.popupUser.style.display = "none";
        }    

        this.appendElements(this.popupContent, [this.spanClose, this.pic, this.name, this.street, this.city, this.state, this.email, this.phone]);
        this.popupUser.appendChild(this.popupContent);

        document.body.appendChild(this.popupUser);
    }
    
}

const usersList = new usersListClass({});

function onClickUser() {
    let u = usersList._users[this.id];
    usersList.name.innerHTML = u.name.title + ' ' + u.name.first + ' ' + u.name.last;
    usersList.pic.setAttribute("src", u.picture.large); 
    usersList.street.innerHTML = 'Street: ' + u.location.street;
    usersList.city.innerHTML = 'City: ' + u.location.city;
    usersList.state.innerHTML = 'State: ' + u.location.state;
    usersList.email.innerHTML = 'Email: ' + u.email;
    usersList.phone.innerHTML = 'Phone: ' + u.phone;

    usersList.popupUser.style.display = "block";
}
    
function SortOrder() {
    usersList.ResortUsers(sortselect.options.selectedIndex);
}
