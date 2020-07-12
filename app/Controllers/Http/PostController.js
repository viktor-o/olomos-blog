'use strict'

const Category = use('App/Models/Category')
const Post = use('App/Models/Post')
const PostCreator = use('PostCreator')

class PostController {
  async index({ view, response }) {
    response.header('Turbolinks-Location', '/posts')

    const posts = await Post.all().then(data => data.toJSON())

    return view.render('posts.posts', { posts })
  }

  async create({ view, response }) {
    response.header('Turbolinks-Location', '/posts/add')

    const categories = await Category.all().then(data => data.toJSON())
    const markdown = '---\ntitle: \nseo_title: \npublished: false \nseo_description: \npost_slug: \nsummary: \n---\n\nThe Title is above...\n\nFront matter above, and write your post here... '.trim()

    return view.render('posts.editor', {
      categories,
      markdown
    })
  }

  async preview({ request, response }) {
    const { markdown } = request.post()

    //transform md to html

    const {body} = PostCreator.create(markdown)

    return response.status(200).json({
      data: body
    })
  }

  async store({ request, response  }) {
    const { markdown, category_id } = request.post()

    // transform md to html
    // grab post meta data from the front matter

    let {
      body, 
      attributes: {
      title,
      seo_title,
      seo_description,
      seo_keywords,
      post_slug,
      summary,
      published
    }} = PostCreator.create(markdown)

    post_slug = post_slug || title

    const post = await Post.create({
      body,
      markdown,
      title,
      seo_title,
      seo_description,
      seo_keywords,
      post_slug,
      summary,
      published,
      category_id
    }).then(data => data.toJSON())

    return response.redirect('/posts/' + post.slug)
  }

  async show({ params: { slug }, view, response }) {
    const post = await Post.findBy('slug', slug)

    response.header('Turbolinks-Location', '/posts/' + slug)

    return view.render('posts.post', {
      post
    })
  }

  async edit() {}

  async update() {}

  async destroy({ params: { id }, response }) {
    const post = await Post.find(id)

    const deleted = post.delete()

    return response.status(200).json({ deleted })
  }
}

module.exports = PostController
