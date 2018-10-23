import './wealth.less'
import 'bootstrap-treeview/dist/bootstrap-treeview.min.css'
import 'bootstrap-treeview/dist/bootstrap-treeview.min'
import '../static/img/404.jpg'

const tree = [
    {
        text: '编程',
        selectable: false,
        nodes: [
            {
                text: 'JAVA',
                selectable: false,
                nodes: [
                    {
                        text: '基础'
                    },
                    {
                        text: '多线程'
                    }
                ]
            },
            {
                text: 'Python'
            }
        ]
    },
    {
        text: '操作系统',
        selectable: false,
        nodes: [
            {
                text: 'Windows'
            },
            {
                text: 'Linux'
            }
        ]
    },
    {
        text: '数据库',
        selectable: false,
        nodes: [
            {
                text: 'Mysql'
            },
            {
                text: 'Oracle'
            },
            {
                text: 'MongoDB'
            }
        ]
    },
    {
        text: '算法',
        selectable: false,
        nodes: [
            {
                text: '排序'
            }
        ]
    },
    {
        text: '数学',
    }
];

$('#tree').treeview({
    data: tree,
    levels: 10,
    collapseIcon:'glyphicon glyphicon-chevron-down',
    expandIcon:'glyphicon glyphicon-chevron-right',
    emptyIcon:'glyphicon glyphicon-list-alt',
    showTags: true,
    onNodeSelected: (event, node) => {
        console.info('选择[' + node.text+']菜单');
        // TODO
    }
});

$('#tree').treeview('collapseAll', { silent: true }); // 默认关闭菜单

