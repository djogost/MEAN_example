const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(result => {
    res.status(201).json({
      message: "Posts added successfully!",
      post: {
        ...result,
        id: result._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: "Creating a post faild!"
    })
  });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  console.log(post);
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({message: "Update successful!"});
      } else {
        res.status(401).json({message: "Not authorized"});
      }
    }).catch(error => {
    res.status(500).json({
      message: "Updating a post faild!"
    })
  });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentSize = req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentSize) {
    postQuery.skip(pageSize * (currentSize - 1))
      .limit(pageSize);
  }

  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    }).then(count => {
    return res.status(200).json({
      message: "Posts fetched successfully",
      posts: fetchedPosts,
      maxPosts: count
    });
  }).catch(error => {
    res.status(500).json({
      message: "Featching posts faild!"
    })
  });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        return res.status(200).json(post);
      } else {
        return res.status(404).json({
          message: "Posts not found!"
        });
      }
    }).catch(error => {
    res.status(500).json({
      message: "Featching post faild!"
    })
  });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({message: "Post deleted!"});
      } else {
        res.status(401).json({message: "Not authorized"});
      }
    }).catch(error => {
    res.status(500).json({
      message: "Deleting post faild!"
    })
  });
};

