class APIfeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter() {
    const queryObj = { ...this.queryString }
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search']
    excludedFields.forEach((el) => delete queryObj[el])

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`)
    this.query = this.query.find(JSON.parse(queryStr))

    return this
  }

  search() {
    if (this.queryString.search) {
      const searchStr = this.queryString.search
      this.query = this.query.find({
        $or: [
          { title: { $regex: searchStr, $options: 'i' } },
          { textContent: { $regex: searchStr, $options: 'i' } },
          { category: { $regex: searchStr, $options: 'i' } },
        ],
      })
    }
    return this
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.split(',').join(' ')

      if (sortBy.includes('date')) {
        sortBy = sortBy.replace('date', '-createdAt')
      }

      if (sortBy.includes('rating')) {
        sortBy = sortBy.replace('rating', '-averageRating')
      }
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt')
    }

    return this
  }

  limit() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }

    return this
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1
    const limit = parseInt(this.queryString.limit, 10) || 9
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}

module.exports = APIfeatures
