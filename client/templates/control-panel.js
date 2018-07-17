import './control-panel.html'

AutoForm.addHooks('createRepresentationForm', {
    formToDoc(doc) {
        let startTimeHours, startTimeMinutes, startDate, endTimeHours, endTimeMinutes, endDate;
        startTimeHours = Number.parseInt(doc.startingTime.slice(0, 2));
        startTimeMinutes = Number.parseInt(doc.startingTime.slice(3, 5));
        endTimeHours = Number.parseInt(doc.endingTime.slice(0, 2));
        endTimeMinutes = Number.parseInt(doc.endingTime.slice(3, 5));
        startDate = new Date(doc.date);
        startDate.setHours(startTimeHours);
        startDate.setMinutes(startTimeMinutes);
        doc.startingTime = startDate; 
        endDate = new Date(doc.date);
        endDate.setHours(endTimeHours);
        endDate.setMinutes(endTimeMinutes);
        doc.endingTime = endDate;
        console.log(doc);
        return doc;
    }
});
