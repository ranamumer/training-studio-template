const elements = {
	docElement: document.documentElement,
	body: document.body,
	preloader: document.getElementById('pre--loader'),
	header: document.getElementById('header'),
	nav: document.getElementById('header--nav'),
	navList: document.getElementById('header--nav__list'),
	navHeading: document.getElementById('header--nav__heading'),
	navBtns: Array.from(document.querySelectorAll('#header--nav__list a[href]')),
	hamburger: document.getElementById('header--nav__hamburger'),
	classesBtns: Array.from(document.querySelectorAll('.training--class__btn')),
	scheduleBtns: Array.from(document.querySelectorAll('.schedule--day'))
};

/* ----------------------------- Pre-loader ------------------------------ */
window.addEventListener('load', () => {
	elements.body.classList.remove('no--scroll');
	elements.preloader.classList.add('hide--loader');
});

/* ----------------------------- Hamburger ------------------------------ */

elements.hamburger.addEventListener('click', toggleNavList);

function toggleNavList() {
	document.body.classList.toggle('no--scroll');
	elements.navList.classList.toggle('set--height');
	elements.hamburger.firstElementChild.classList.toggle('toggle--hamburger');
}

/* ----------------------------- Navigation Bar ------------------------------ */

window.onscroll = () => {
	toggleNavigationBar();
	if (elements.docElement.clientWidth > 750 || elements.body.clientWidth > 750) changeNavBtnsColor();
};

function toggleNavigationBar() {
	// toggle display of navigation bar
	if (
		elements.docElement.scrollTop > elements.nav.offsetHeight &&
		elements.docElement.scrollTop < elements.header.offsetHeight
	) {
		elements.nav.classList.add('hide--nav');
	} else {
		elements.nav.classList.remove('hide--nav');
	}

	// toggle navbar && its element styles
	if (elements.docElement.scrollTop >= elements.header.offsetHeight) {
		elements.nav.classList.add('change--nav__bg');
		elements.navHeading.classList.add('change--navheading__color');
		elements.navBtns.forEach((btn) => btn.classList.add('grey'));
	} else {
		elements.nav.classList.remove('change--nav__bg');
		elements.navHeading.classList.remove('change--navheading__color');
		elements.navBtns.forEach((btn) => btn.classList.remove('grey'));
	}
}

function changeNavBtnsColor() {
	elements.navBtns.forEach((btn) => {
		// get section
		const section = document.querySelector(btn.getAttribute('href'));
		// if section is currently in view then change current btn color
		if (
			elements.docElement.scrollTop >= section.offsetTop &&
			elements.docElement.scrollTop <= section.offsetHeight + section.offsetTop - elements.nav.offsetHeight
		) {
			btn.classList.add('orange');
		} else {
			btn.classList.remove('orange');
		}
	});
}

elements.navBtns.forEach((btn) =>
	btn.addEventListener('click', function(e) {
		// prevent default behaviour
		e.preventDefault();
		// Toggle Nav List
		if (elements.docElement.clientWidth < 750 || elements.body.clientWidth < 750) toggleNavList();
		// Scroll to the clicked section
		document.querySelector(this.getAttribute('href')).scrollIntoView({
			block: 'start',
			behavior: 'smooth',
			inline: 'start'
		});
	})
);

/* ----------------------------- Classes ------------------------------ */
elements.classesBtns.forEach((btn) => btn.addEventListener('click', changeShowcaseData));

function changeShowcaseData() {
	// remove active class from the heading of previous training button
	document.querySelector('.training--class__btn h4.active').classList.remove('active');
	// add active class to the heading of current training button
	this.lastElementChild.classList.add('active');
	// changing training showcase heading
	document.querySelector('#classes--content__showcase h4').textContent = this.lastElementChild.textContent;
	// changing training showcase image
	document.querySelector(
		'#classes--content__showcase img'
	).src = `./images/training-image-${elements.classesBtns.indexOf(this)}.jpg`;
}

/* ----------------------------- Schedule ------------------------------ */
elements.scheduleBtns.forEach((sd) => sd.addEventListener('click', changeSchedule));
// get timetable (schedule) object
const schedule = (function() {
	const Schedule = function(trainingName, firstTiming, secondTiming) {
		this.trainingName = trainingName;
		this.firstTiming = firstTiming;
		this.secondTiming = secondTiming;
	};

	const time1 = '10:00AM - 11:30AM';
	const time2 = '2:00PM - 3:30PM';
	const off = '';

	return {
		monday: [ new Schedule('fitness--class', time1, off), new Schedule('body--building', off, time2) ],
		tuesday: [ new Schedule('fitness--class', off, time2), new Schedule('body--building', time1, off) ],
		wednesday: [ new Schedule('yoga--training', time1, off), new Schedule('advanced--training', off, time2) ],
		thursday: [ new Schedule('muscle--training', off, time2), new Schedule('advanced--training', time1, off) ],
		friday: [ new Schedule('muscle--training', time1, off), new Schedule('yoga--training', off, time2) ]
	};
})();

function changeSchedule() {
	// previous active day button
	const activeDay = document.querySelector('.schedule--day.active');
	// remove active class from previous active day button
	activeDay.classList.remove('active');
	// clear previous content from schedule table
	schedule[activeDay.textContent.toLowerCase()].forEach((scheduleObj) => {
		const trainingNode = document.getElementById(scheduleObj.trainingName);
		trainingNode.firstElementChild.nextElementSibling.textContent = '';
		trainingNode.firstElementChild.nextElementSibling.nextElementSibling.textContent = '';
	});

	// add active class to clicked button
	this.classList.add('active');
	// add content of cliked button to schedule table
	schedule[this.textContent.toLowerCase()].forEach((scheduleObj) => {
		const trainingNode = document.getElementById(scheduleObj.trainingName);
		trainingNode.firstElementChild.nextElementSibling.textContent = scheduleObj.firstTiming;
		trainingNode.firstElementChild.nextElementSibling.nextElementSibling.textContent = scheduleObj.secondTiming;
	});
}
