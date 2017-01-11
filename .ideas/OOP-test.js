function mix(...mixins) {
	class Mix {}

	for (let mixin of mixins) {
		_.assign(Mix, mixin);
		_.assign(Mix.prototype, mixin.prototype);
	}
	return Mix;
}

class Record {
	/*
	Fields :
		- title
		- tags
	 */

	constructor(a) {
		_.assign(this, a);
	}

	save() {
		console.log('Record', 'saving', this);
	}
	delete() {
		console.log('Record', 'deleting', this);
	}
	edit(a) {
		_.assign(this, a);
		console.log('Record', 'editing', this);
	}
	toSpeech() {
		return `Record titled ${title} with ${tags.join(' and ')} tags`;
	}
}

class Note extends Record {
	/*
	Fields :
		- text
	 */

	constructor(a) {
		super(a);
		this.text = a.text;
	}
	save() {
		console.log('Note', 'saving', this);
	}
}

class Reminder extends Record {
	/*
	Fields :
		- date
		- time
		- notificationType
		- notifyTime
		- notifyInterval
	 */

	constructor(a) {
		super(a);
	}

	ignore() {this.notificationType = false;}
	silence() {this.notificationType = 'silent';}
}

class Event extends mix(Note, Reminder) {
	constructor(a) {
		super(a);
	}
}

class List extends Record {

	constructor(a) {
		super(a);
		this.list = [];
	}

	addItem(text) {
		this.list.push({id:Math.random(), text});
	}

	removeItem({id, text}) {

	}
}

class CheckList extends List {
	constructor(a) {
		super(a);
		this.checkedList = [];
	}

	checkItem({id, text}) {

	}

	checkItem({id, text}) {

	}
}
