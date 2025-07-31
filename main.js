var dataService = new TaskDataService();
    var treegrid = new ej.treegrid.TreeGrid({
        hasChildMapping: 'isParent',
        idMapping: 'TaskID',
        parentIdMapping: 'parentID',
        height: 400,
        allowPaging: true,
        pageSettings: { pageSize: 20 },
        filterSettings: {type: 'Excel'},
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
        var state = { skip: 0, take: 20 };
        var result = dataService.execute(state, query);
        treegrid.dataSource = result;
    }
    function dataStateChange(state) {
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