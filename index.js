import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import {logger} from 'hono/logger'
import { serveStatic } from '@hono/node-server/serve-static'
import { renderFile } from 'ejs'
import { title } from 'process'


const todos = [
    {
        id: 1,
        title: 'Udělat úkol na node',
        done: false,
    },
    {
        id: 2,
        title: 'Uklidit',
        done: false,   
    },
]

const app = new Hono()

app.use(logger())
app.use(serveStatic({ root: 'public'}))

app.get('/', async (c) => {
    const rendered = await renderFile('views/index.html', {
        title: 'My todo app',
        todos,
    })

    return c.html(rendered)
})

app.get('/todo/:id', async (c) => {
    const id = Number(c.req.param('id'))
    const todo = todos.find((todo) => todo.id === id)

    if (!todo) return c.notFound()

    const rendered = await renderFile('views/todo.html', {
        title: 'Detail todo',
        todo,
    })

    return c.html(rendered)
})

app.post('/todos', async (c) => {
    const form = await c.req.formData()


todos.push({
    id: todos.length + 1,
    title: form.get('title'),
    done: false
})


return c.redirect('/')
})


app.post('/todo/:id', async (c) => {
    const id = Number(c.req.param('id'))

    const todo = todos.find((todo) => todo.id === id)

    if (!todo) return c.notFound()

    const form = await c.req.formData()
    const newTitle = form.get('title')

    if (typeof newTitle === 'string' && newTitle.trim() !== '') {
        todo.title = newTitle.trim()
    }

    return c.redirect('/todo/' + id)
})


app.get('/todos/:id/toggle', async (c) => {
    const id = Number(c.req.param('id'))

    const todo = todos.find((todo) => todo.id === id)

    if (!todo) return c.notFound()

    todo.done = !todo.done

    return c.redirect('/')
})

app.get('/todos/:id/remove', async (c) => {
    const id = Number(c.req.param('id'))

    const index = todos.findIndex((todo) => todo.id === id)
    todos.splice(index, 1)

    return c.redirect('/')

})

app.get('/todo/:id/toggle', async (c) => {
    const id = Number(c.req.param('id'))
    const todo = todos.find((todo) => todo.id === id)


    if (!todo) return c.notFound()

    todo.done = !todo.done

    return c.redirect('/todo/' + id)
})


serve(app, (info) => {
    console.log('App started on http://localhost:' + info.port)
})