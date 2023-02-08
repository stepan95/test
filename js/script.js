class Tests {
	constructor(test) {
		this.test = test;
		this.testId = document.getElementById('test');
		this.personalInformation = '';
		
		this.testDownload();
		this.selectedOptions();
		this.buttonExtend();
		this.personalInfoWindow();
	}
	active(el) {
		const active = el.classList[0];
	    if (active != undefined) el.classList.remove("active");
	    else el.classList.add("active");
	}
	selectedOptions() {
		const tests = this;
		const getElements =  document.querySelectorAll('#test .question p');
		for (let i = 0; i < getElements.length; i++) {
			getElements[i].addEventListener('click', function() {
				tests.active(this);
			});
		}
	}
	testDownload() {
		let template = '';
		let numbering = 1;
		let column = 1;
		for (let i = 0; i < this.test.length; i++) {
			template = `
				<div class="question">
					<span>`+numbering+++`</span>
					<p data-options="a" data-column="`+column+`">`+this.test[i][0]+`</p>
					<p data-options="б" data-column="`+column+`">`+this.test[i][1]+`</p>
					<p data-options="в" data-column="`+column+`">`+this.test[i][2]+`</p>
				</div>
			`;
			column == 3 ? column = 1 : column++;
			this.testId.insertAdjacentHTML('beforeend', template);
		}
	}
	getResult() {
		let active = this.testId.querySelectorAll('.active');
		const points = {
			a1: 0,
			a2: 0,
			a3: 0,
			b1: 0,
			b2: 0,
			b3: 0,
			v1: 0,
			v2: 0,
			v3: 0,
		}
		for (let i = 0; i < active.length; i++) {
			if (active[i].dataset.options == 'a' && active[i].dataset.column == '1') points.a1++;
			if (active[i].dataset.options == 'a' && active[i].dataset.column == '2') points.a2++;
			if (active[i].dataset.options == 'a' && active[i].dataset.column == '3') points.a3++;
			if (active[i].dataset.options == 'б' && active[i].dataset.column == '1') points.b1++;
			if (active[i].dataset.options == 'б' && active[i].dataset.column == '2') points.b2++;
			if (active[i].dataset.options == 'б' && active[i].dataset.column == '3') points.b3++;
			if (active[i].dataset.options == 'в' && active[i].dataset.column == '1') points.v1++;
			if (active[i].dataset.options == 'в' && active[i].dataset.column == '2') points.v2++;
			if (active[i].dataset.options == 'в' && active[i].dataset.column == '3') points.v3++;
		}
		// Точки для побудови рафіку
		const pointsArray = [
			[points.v3, 'в3'],
			[points.v1, 'в1'],
			[points.b1, 'б1'],
			[points.b2, 'б2'],
			[points.b3, 'б3'],
			[points.a3, 'а3'],
			[points.a2, 'а2'],
			[points.a1, 'а1'],
			[points.v2, 'в2'],
		];
		const scheduleWindow = document.getElementById('scheduleWindow');
		document.body.style.overflow = 'hidden';
		scheduleWindow.style.opacity = 1;
		scheduleWindow.style.visibility = 'visible';

		const a = ((points.a1+points.a2+points.a3)*100/30).toFixed(1);
		const b = ((points.b1+points.b2+points.b3)*100/30).toFixed(1);
		const v = ((points.v1+points.v2+points.v3)*100/30).toFixed(1);

		const results = 'Майстер-діяч: '+a+'% | '+'Художник-глядач: '+b+'% | '+'Мислитель-слухач: '+v+'%.';
		// Створюємо обєкт на основі класу
		const schedule = new Schedule(pointsArray, 10, this.personalInformation, results, true, document.getElementById('scheduleWindow').getElementsByTagName('div')[1]);
		setTimeout(function() {
			schedule.render();
		}, 2000);
		

		document.getElementById('results-a').textContent = 'Профіль практичної обдарованості «майстра-діяча» '+a+'%.';
		document.getElementById('results-b').textContent = 'Профіль естетичної обдарованості «художника-глядача» '+b+'%.';
		document.getElementById('results-v').textContent = 'Профіль академічної обдарованості «мислителя-слухача» '+v+'%.';
	}
	noPermissionWindow() {
		const backgroundWindow = document.getElementById('backgroundWindow');
		backgroundWindow.style.opacity = 1;
		backgroundWindow.style.visibility = 'visible';
		backgroundWindow.addEventListener('click', function() {
			this.style.opacity = 0;
			this.style.visibility = 'hidden';
		});
	}
	personalInfoWindow() {
		const tests = this;
		document.getElementById('extendStart').addEventListener('click', function() {
			const infoWindow = document.getElementById('personalInformation');
			const input = infoWindow.getElementsByTagName('input')[0];
			tests.personalInformation = input.value;
			infoWindow.style.opacity = 0;
			infoWindow.style.visibility = 'hidden';
		});
	}
	buttonExtend() {
		const tests = this;
		document.getElementById('extend').addEventListener('click', function() {
			let question = tests.testId.getElementsByClassName('question');
			for (let i = 0; i < question.length; i++) {
				if (question[i].getElementsByClassName('active').length == 0) {
					tests.noPermissionWindow()
					return;
				}
			}
			this.style.opacity = 0;
			this.style.visibility = 'hidden';
			tests.getResult();
		});
	} 
}

new Tests(test);

