var dataService = new TaskDataService();
var treegrid = new ej.treegrid.TreeGrid({
    hasChildMapping: 'isParent',
    idMapping: 'TaskID',
    parentIdMapping: 'parentID',
    height: 400,
    allowPaging: true,
    pageSettings: { pageSize: 60 },
    filterSettings: { type: 'Excel' },
    allowSorting: true,
    allowMultiSorting: true,
    allowFiltering: true,
    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
    query: new ej.data.Query().addParams('ej2treegrid', 'true'),
    editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        mode: 'Row',
        newRowPosition: 'Top',
    },
    actionComplete: function (args) {
        debugger;
        if (args.requestType === 'add' && args.form) {
            args.form.querySelector('#TreeGrid_gridcontrolTaskID').value = 100000;
            args.form.querySelector('#TreeGrid_gridcontrolTaskName').value = 'New Task';
            args.form.querySelector('#TreeGrid_gridcontrolStartDate').value = '1/8/2025';
            args.form.querySelector('#TreeGrid_gridcontrolEndDate').value = '1/15/2025';
            args.form.querySelector('#TreeGrid_gridcontrolDuration').value = 7;
            args.form.querySelector('#TreeGrid_gridcontrolProgress').value = 80;
            args.form.querySelector('#TreeGrid_gridcontrolPriority').value = 'High';
        }
    },
    treeColumnIndex: 1,
    columns: [
        { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120, isPrimaryKey: true },
        { field: 'TaskName', headerText: 'Task Name', width: 200 },
        {
            field: 'StartDate',
            headerText: 'Start Date',
            textAlign: 'Right',
            width: 120,
            format: { skeleton: 'yMd', type: 'date' },
        },
        {
            field: 'EndDate',
            headerText: 'End Date',
            textAlign: 'Right',
            width: 120,
            format: { skeleton: 'yMd', type: 'date' },
        },
        {
            field: 'Duration',
            headerText: 'Duration',
            width: 110,
            textAlign: 'Right',
        },
        { field: 'Progress', headerText: 'Progress', width: 110 },
        { field: 'Priority', headerText: 'Priority', width: 130 },
    ],
    load: load,
    dataStateChange: dataStateChange,
    dataSourceChanged: dataSourceChanged
});
treegrid.appendTo('#TreeGrid');
function load() {
    var query = treegrid.query;
    var state = { skip: 0, take: 60 };
    var result = dataService.execute(state, query);
    treegrid.dataSource = result;
}
function dataStateChange(state) {
    console.log('DataStateChange event was triggered');
    console.log(state);
    var query = treegrid.grid.getDataModule().generateQuery();
    if (state.action.requestType === 'expand') {
        state.action.childData = dataService.execute(state, query);
        state.action.childDataBind();
    }
    else if (state.action &&
        (state.action.requestType === 'filterchoicerequest' ||
            state.action.requestType === 'filtersearchbegin')) {
        var data = dataService.execute(state, query);
        state.dataSource(data.result);
    }
    else {
        treegrid.dataSource = dataService.execute(state, query);
    }
}
function dataSourceChanged(state) {
    console.log('DataSourceChanged event was triggered');
    console.log(state);
    if (state.action === 'add') {
        dataService.addRecord(state.data, state.index);
        state.endEdit();
    }
    else if (state.action === 'edit') {
        dataService.editRecord(state.data);
        state.endEdit();
    }
    else if (state.requestType == 'delete') {
        dataService.deleteRecord(state.data);
        state.endEdit();
    }
}
