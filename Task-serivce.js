var projectData = [];
var recordCount = 10000; // Or any number you want
var childrenPerParent = 4; // 1 parent + 4 children in each group

let taskId = 1;
for (let i = 0; i < recordCount; i += (childrenPerParent + 1)) {
  // Parent row
  projectData.push({
    TaskID: taskId,
    TaskName: `Parent Task ${taskId}`,
    StartDate: new Date('2023-01-01'),
    Duration: 5,
    Priority: 'Normal',
    EndDate: new Date('2023-01-06'),
    Progress: '100',
    isParent: true,
    parentID: null
  });

  // Children - adjust fields as needed!
  for (let j = 1; j <= childrenPerParent; j++) {
    projectData.push({
      TaskID: taskId + j,
      TaskName: `Child ${j} of Parent ${taskId}`,
      StartDate: new Date('2023-01-07'),
      Duration: 2 + j,
      Priority: ['Low', 'Normal', 'High', 'Critical'][j % 4],
      EndDate: new Date('2023-01-09'),
      Progress: Math.floor(Math.random() * 100).toString(),
      isParent: false,
      parentID: taskId
    });
  }
  taskId += (childrenPerParent + 1);
}
let data = projectData;
class TaskDataService {
  
   execute(state, query) {
    if (state.action ? state.action.requestType === 'expand' : state.requestType === 'expand') {
      return this.getChildData(state);
    }
    else {
      return this.getAllData(state, query);
    }

  }

   getChildData(state) {
    const parentId = state.action.data.TaskID;
    return data.filter((x) => x.parentID === parentId);
  }


   getAllData(state, action) {
    const query = new ej.data.Query();
    if (state.where) {
      this.applyFiltering(query, action.queries);
    }
    // initial filtering
    if (state.filter && state.filter.columns && state.filter.columns.length) {
      this.applyFiltering(query, state.filter);
    }
    if (state.search) {
      this.applySearching(query, state.search);
    };
    // sorting
    if (state.sorted) {
      state.sorted.length ? this.applySorting(query, state.sorted) :
        // initial sorting
        state.sorted.columns.length ? this.applySorting(query, state.sorted.columns) : null
    }
    this.applyPaging(state, query);
    query.where('parentID', 'equal', null);
    // query.addParams('IdMapping', 'TaskID');
    query.isCountRequired = true;
    var dat = new ej.data.DataManager(projectData).executeLocal(query);
    // const rootRecords = data.filter((x) => x.parentID === null);
    // return { result: rootRecords.slice(state.skip, state.skip + state.take), count: rootRecords.length }
    return new ej.data.DataManager(projectData).executeLocal(query);

  }



   applyPaging(state, query) {
    if (state.take && state.skip) {
      // Calculate pageSkip and pageTake values to get pageIndex and pageSize
      const pageSkip = state.skip / state.take + 1;
      const pageTake = state.take;
      query.page(pageSkip, pageTake);
    }
    // If if only 'take' is available and 'skip' is 0, apply paging for the first page.
    else if (state.skip === 0 && state.take) {
      query.page(1, state.take);
    }
  }

   applyFiltering(query, filter) {
    // Check if filter columns are specified
    if (filter.columns && filter.columns.length) {
      // Apply filtering for each specified column
      for (let i = 0; i < filter.columns.length; i++) {
        const field = filter.columns[i].field;
        const operator = filter.columns[i].operator;
        const value = filter.columns[i].value;
        query.where(field, operator, value);
      }
    }
    else {
      // Apply filtering based on direct filter conditions
      for (let i = 0; i < filter.length; i++) {
        const { fn, e } = filter[i];
        if (fn === 'onWhere') {
          query.where(e);
        }
      }
    }
  }

   applySearching(query, search) {
    // Check if a search operation is requested
    if (search && search.length > 0) {
      // Extract the search key and fields from the search array
      const { fields, key } = search[0];
      // perform search operation using the field and key on the query
      query.search(key, fields);
    }
  }

   applySorting(query, sorted) {
    // Check if sorting data is available
    if (sorted && sorted.length > 0) {
      // Iterate through each sorting info
      sorted.forEach((sort) => {
        // get the sort field name either by name or field
        const sortField = sort.name || sort.field;
        // Perform sort operation using the query based on the field name and direction
        query.sortBy(sortField, sort.direction);
      });
    }
  }

   addRecord(record, index) {
    data.splice(index, 0, record);
  }

   editRecord(record) {
    for (let j = 0; j < data.length; j++) {
      if ((data)[j]['TaskID'] == record['TaskID']) {
        data[j] = record;
        break;
      }
    }
  }

   deleteRecord(records) {
    for (let i = 0; i < records.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if ((data)[j]['TaskID'] == records[i]['TaskID']) {
          data.splice(j, 1);
          break;
        }
      }
    }
  }
}
window.TaskDataService = TaskDataService;