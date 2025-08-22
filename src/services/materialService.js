import useApiFetch from '@/composables/useApiFetch'

export async function queryCategory() {
  return await queryByType('CATEGORY')
}

export async function querySeries() {
  return await queryByType('SERIES')
}

export async function queryCarousel() {
  return await queryPublicType('CAROUSEL')
}

export async function queryPasswords() {
  return await queryByType('PASSWORD')
}

export async function queryFriends() {
  return await queryPublicType('FRIEND')
}

export async function queryNews() {
  return await queryPublicType('NEWS')
}

async function queryPublicType(type) {
  const fetch = useApiFetch()
  const res = await fetch(`/material/public-type/${type}`)
  return res.data
}

export async function save(data) {
  const fetch = useApiFetch()
  const res = await fetch(`/material/save`, {
    method: 'POST',
    body: data,
  })
  return res
}

export async function remove(data) {
  const fetch = useApiFetch()
  const { type, id } = data
  return await fetch(`/material/${type}/${id}`, {
    method: 'DELETE',
  })
}

async function queryByType(type) {
  const fetch = useApiFetch()
  const res = await fetch(`/material/type/${type}`)
  // result是扁平化的数组，包含id，pid和content，将其转为符合TreeSelect格式
  if (type !== 'CATEGORY') {
    return res.data
  }
  // 按id升序排序
  const categories = res.data.sort((a, b) => a.id - b.id)
  const tree = categories.reduce((acc, cur) => {
    acc[cur.id] = {
      label: cur.content,
      value: cur.id,
      pid: cur.pid,
      children: [],
    }
    if (cur.pid) {
      acc[cur.pid].children.push(acc[cur.id])
    }
    return acc
  }, {})
  // 过滤出根节点
  const rootNodes = Object.values(tree).filter((item) => !item.pid)
  // 只有叶子结点可以选择
  rootNodes.forEach((item) => {
    if (item.children.length > 0) {
        item.selectable = false
    }
  })
  return rootNodes
}