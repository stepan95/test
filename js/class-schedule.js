/*
Клас Schedule для візуалізації кругових графіків
Приймає масив відповідей
Приймає кількість точок на напрямку
Приймає текст

Цей метод запускає рендер render();
*/

class Schedule {
	constructor(points, step = 10, textName = '', textBottom = '', downloadButton = true, downloadBut = document.body) {
		this.points = points;
		this.textName = textName;
		this.textBottom = textBottom;
		this.step = step;
		this.downloadButton = downloadButton;
		this.downloadBut = downloadBut;
		

		// Параметри полотна
		this.canvas = document.getElementById('schedule');
		this.ctx = this.canvas.getContext('2d');
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.wCenter = this.width / 2;
		this.hCenter = this.height / 2;
		this.color = "#2633b4";
		this.color2 = "rgb(38 51 180 / 1%)";

		// Дижурні параметри
		this.size = 4;
		this.sizeSchedule = 450;
		this.stepSchedule = this.sizeSchedule / this.step;
		this.drawScheduleFrame = 0;
		this.directionLine = [];
	}
	// Малюємо квадратом
	draw(x, y) {
		ctx.fillStyle = this.color;
		ctx.fillRect(wCenter+x, hCenter+y, size / 2, size / 2);
	}
	// Малюємо колом
	drawArc(x, y, r = 1) {
		this.ctx.beginPath();
		this.ctx.fillStyle = this.color;
		this.ctx.strokeStyle = this.color;
		this.ctx.arc(this.wCenter+x, this.hCenter+y, r, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
	}
	// Малюємо графік
	drawSchedule() {
		for(let i = 0; i < this.points.length; i++) {
			this.drawArc(this.directionLine[i].x *this.drawScheduleFrame, this.directionLine[i].y *this.drawScheduleFrame);
		}


		
		this.drawScheduleFrame+=9;
	}
	// Малюємо результат
	drawPlane() {
		this.ctx.fillStyle = this.color2;
		this.ctx.beginPath();
		for(let i = 0; i < this.points.length; i++){
			if (i == 0)
			    this.ctx.moveTo(this.wCenter+this.directionLine[i].x*this.stepSchedule*this.points[i][0], this.hCenter+this.directionLine[i].y*this.stepSchedule*this.points[i][0]);
			else 
			    this.ctx.lineTo(this.wCenter+this.directionLine[i].x*this.stepSchedule*this.points[i][0], this.hCenter+this.directionLine[i].y*this.stepSchedule*this.points[i][0]);
		}
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.stroke();
	}
	// Додаємо текст
	text() {
		this.ctx.font = '26px Arial';
		this.ctx.fillStyle = "red";
		this.ctx.fillText(this.textName, 20, 40);
		this.ctx.fillText(this.textBottom, 20, this.height - 26);

		this.ctx.font = '20px Arial';

		for(let i = 0; i < this.points.length; i++) {
			this.ctx.fillText(this.points[i][1], this.wCenter+this.directionLine[i].x*this.sizeSchedule+(this.directionLine[i].x*30-10), this.hCenter+this.directionLine[i].y*this.sizeSchedule+(this.directionLine[i].y*3*10));
		}
	}
	// Створюємо та задаємо напрям направляючих графіку
	createDirection() {
		for(let i = 0; i < 360; i += 360 / this.points.length){
			let x = Math.cos(i * Math.PI /180);
			let y = Math.sin(i * Math.PI /180);
			this.directionLine.push({x: x, y: y});
		}
	}
	// Зафарбовуємо полотно у білий колір
	background() {
		this.ctx.fillStyle = "#fff";
		this.ctx.fillRect(0, 0, this.width, this.height);
	}
	// Запускаємо анімацію графіку
	animation(){
		const schedule = this;
		let pass = 0;
		let counterPoints = 0;
		let counterStep = 1;
		function animation() {
			if (schedule.sizeSchedule != schedule.drawScheduleFrame) 
				schedule.drawSchedule();
			else {
				pass++;
				if (pass <= 20) {
					schedule.drawPlane();
				}
			}
			// Перевіряємо напрямки та переходимо ряд
			if (schedule.points.length == counterPoints) {
				counterPoints = 0;
				counterStep++;
			}
			// Малюємо точки
			schedule.drawArc(schedule.directionLine[counterPoints].x *schedule.stepSchedule*counterStep, schedule.directionLine[counterPoints].y *schedule.stepSchedule*counterStep, 3);
			counterPoints++;

			// Зупиняємо анімацію
			if (schedule.step == counterStep && schedule.points.length == counterPoints && pass >= 20) {
				if (schedule.downloadButton) schedule.downloads();
				return;
			}

			window.requestAnimationFrame(animation);
		}
		animation();
	}
	// Запускаємо всі процеси та візуалізуємо графік
	render() {
		this.background();
		this.createDirection();
		this.animation();
		this.text();
	}
	// Додаємо кнопку скачати результат
	downloads() {
		const schedule = this;
		function blobCallback(imgName) {
		  return function(b) {
		    var a = document.createElement('a');
		    a.textContent = 'Завантажити графік';
		    schedule.downloadBut.appendChild(a);
		    a.style.display = 'block';
		    a.setAttribute('class', 'button')
		    a.download = imgName + '.png';
		    a.href = window.URL.createObjectURL(b);
		  }
		}
		this.canvas.toBlob(blobCallback('img'), 'image/vnd.microsoft.png', '-moz-parse-options:format=bmp;bpp=32');
	}
}