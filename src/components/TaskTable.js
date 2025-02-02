import React, { useMemo } from 'react';
import _ from 'lodash';
import { matchSorter } from 'match-sorter';
import { useDispatch, useSelector } from 'react-redux';
import tasks from '../data/tasks';
import Cell from './TaskTableCell';
import Table from './common/Table';
import useBreakpoint, { MEDIA_QUERIES, MODE } from '../hooks/useBreakpoint';
import TaskTableRow from './TaskTableRow';

export default function TaskTable() {
    const isMdOrSmallerViewport = useBreakpoint(MEDIA_QUERIES.MD, MODE.LESS_OR_EQ);
    const isSmViewport = useBreakpoint(MEDIA_QUERIES.SM, MODE.STRICT);
    const isXsViewport = useBreakpoint(MEDIA_QUERIES.XS, MODE.STRICT);

    const data = useMemo(() => tasks, []);
    const columns = useMemo(
        () => [
            {
                Header: 'Id',
                id: 'id',
                accessor: 'id',
            },
            {
                Header: 'Task',
                id: 'task',
                // eslint-disable-next-line no-nested-ternary
                width: isXsViewport ? 0 : isSmViewport ? 375 : 470,
                accessor: row => ({ label: row.label, description: row.description }),
                sortType: sortTask,
                Cell: Cell.Task,
            },
            {
                Header: 'Difficulty',
                id: 'difficulty',
                minWidth: 95,
                width: isMdOrSmallerViewport ? 100 : 150,
                accessor: row => row.difficulty,
                sortType: sortDifficulty,
                Cell: Cell.Difficulty,
            },
            {
                Header: 'Category',
                id: 'category',
                minWidth: 90,
                width: isMdOrSmallerViewport ? 100 : 150,
                accessor: row => ({ category: row.category, subcategory: row.subcategory }),
                sortType: sortCategory,
                Cell: Cell.Category,
            },
        ],
        [isXsViewport, isSmViewport, isMdOrSmallerViewport]
    );
    const defaultColumn = useMemo(
        () => ({
            minWidth: 30,
            width: 150,
            maxWidth: 1000,
        }),
        []
    );
    const filters = [
        difficultyFilter,
        categoryFilter,
        subcategoryFilter,
        skillFilter,
        completedFilter,
        todoFilter,
        ignoredFilter,
    ];
    const initialState = isXsViewport ? { hiddenColumns: ['id', 'difficulty', 'category'] } : { hiddenColumns: ['id'] };
    initialState.pageSize = 50;

    const tasksState = useSelector(state => state.tasks.tasks);
    const tempState = useSelector(state => state.temp);
    const dispatch = useDispatch();

    return (
        <Table
            columns={columns}
            data={data}
            filters={filters}
            globalFilter={fuzzyTextFilter}
            customFilterProps={{ tasksState }}
            defaultColumn={defaultColumn}
            initialState={initialState}
            ExpandedRow={Cell.ExpandedTask}
            enableResizeColumns={!isXsViewport}
            customRowRenderFn={TaskTableRow}
            customRowProps={{ tasksState, tempState, dispatch }}
        />
    );
}

function difficultyFilter(record, filterState) {
    if (filterState.difficulty === null) {
        return true;
    }
    return filterState.difficulty.includes(record.difficulty.label);
}

function categoryFilter(record, filterState) {
    if (filterState.categories === null) {
        return true;
    }
    return filterState.categories.includes(record?.category?.label);
}

function subcategoryFilter(record, filterState) {
    if (filterState.subcategories === null) {
        return true;
    }
    return filterState.subcategories.includes(record?.subcategory?.label);
}

function skillFilter(record, filterState) {
    const taskSkills = record.skillReqs.map(req => req.skill);
    if (filterState.skills === null || taskSkills.length === 0) {
        return true;
    }
    return _.intersection(taskSkills, filterState.skills).length > 0;
}

function completedFilter(record, filterState, { tasksState }) {
    if (filterState.status === 'all') {
        return true;
    }
    const status = !!tasksState[record.id]?.completed;
    return (filterState.status === 'cmpl') === !!status;
}

function todoFilter(record, filterState, { tasksState }) {
    if (filterState.todo === 'all') {
        return true;
    }
    const todo = !!tasksState[record.id]?.todo;
    return (filterState.todo === 'only') === !!todo;
}

function ignoredFilter(record, filterState, { tasksState }) {
    if (filterState.ignored === 'all') {
        return true;
    }
    const ignored = !!tasksState[record.id]?.ignored;
    return (filterState.ignored === 'only') === !!ignored;
}

function sortTask(a, b) {
    return a.values.task.label.localeCompare(b.values.task.label);
}

function sortDifficulty(a, b) {
    return a.values.difficulty.value - b.values.difficulty.value;
}

function sortCategory(a, b) {
    const compareVal = a.values.category.category.label.localeCompare(b.values.category.category.label);
    if (compareVal === 0) {
        const subA = a.values.category.subcategory;
        const subB = b.values.category.subcategory;
        return subA.customSort && subB.customSort
            ? subA.customSort - subB.customSort
            : subA.label.localeCompare(subB.label);
    }
    return compareVal;
}

function fuzzyTextFilter(rows, __, filterValue) {
    return matchSorter(rows, filterValue, {
        threshold: matchSorter.rankings.CONTAINS,
        keys: [
            'values.task.label',
            'values.task.description',
            'values.category.category.label',
            'values.category.subcategory.label',
            'values.requirements.*.skill',
        ],
    });
}
fuzzyTextFilter.autoRemove = val => !val;
