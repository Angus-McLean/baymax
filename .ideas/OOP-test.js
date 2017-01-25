var DB = {};

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
		this.save();
	}

	save() {
		DB.Records[this.id] = this;
	}
	delete() {
		delete DB.Records[this.id];
		console.log('Record', 'deleting', this);
	}
	edit(a) {
		_.assign(this, a);
		this.save()
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

	addItem(object) {
		this.list.push({id:Math.random(), doc : object});
	}

	removeItem(queryObj) {
		_.remove(this.list, queryObj);
	}
}

class CheckList extends List {
	constructor(a) {
		super(a);
		this.markedItems = []
	}

	markItem(queryObj) {
		this.markedItems.push(...(_.remove(this.list, queryObj)));
	}

	unmarkItem({id, text}) {
		this.list.push(...(_.remove(this.markedItems, queryObj)));
	}
}
