import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import {logger} from 'hono/logger'
import { serveStatic } from '@hono/node-server/serve-static'
import { renderFile } from 'ejs'
import { title } from 'process'
import { drizzle } from "drizzle-orm/libsql"
import { todosTable } from "./src/schema.js"
import { eq } from 'drizzle-orm'
 
const db = drizzle({ connection: "file:db.sqlite" })

const app = new Hono()

app.use(logger())
app.use(serveStatic({ root: 'public'}))

app.get('/', async (c) => {
    const todos = await db.select(todosTable).from(todosTable).all()

    const rendered = await renderFile('views/index.html', {
        title: 'My todo app',
        todos,
    })

    return c.html(rendered)
})

app.get('/todo/:id', async (c) => {
    const id = Number(c.req.param('id'))

    const todo = await getTodoById(id)

    if (!todo) return c.notFound()

    const rendered = await renderFile('views/todo.html', {
        title: 'Detail todo',
        todo,
    })

    return c.html(rendered)
})

app.post('/todos', async (c) => {
    const form = await c.req.formData()

    await db.insert(todosTable).values({
        title: form.get('title'),
        done: false
    })

    return c.redirect('/')
})


app.post('/todo/:id', async (c) => {
    const id = Number(c.req.param('id'))

    const todo = await getTodoById(id)

    if (!todo) return c.notFound()

    const form = await c.req.formData()

    const newTitle = form.get('title')

    if (typeof newTitle === 'string' && newTitle.trim() !== '') {
        todo.title = newTitle.trim()
    }

    return c.redirect('/todo/' + id)
})


app.get('/todos/:id/remove', async (c) => {
    const id = Number(c.req.param('id'))

    const todo = await getTodoById(id)
    
    if(!todo) return c.notFound()

    await db.delete(todosTable).where(eq(todosTable.id, id))

    return c.redirect('/')

})

app.get('/toggle/:id', async (c) => {
    const id = Number(c.req.param('id'))

    const todo = await getTodoById(id)

    if (!todo) return c.notFound()

        await db
            .update(todosTable)
            .set({ done: !todo.done})
            .where(eq(todosTable.id, id))

    return c.redirect(c.req.header("Referer"))
})



serve(app, (info) => {
    console.log('App started on http://localhost:' + info.port)
})

const getTodoById = async (id) => {
    const todo = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.id, id))
    .get()

    return todo
} 