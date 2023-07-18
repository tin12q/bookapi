import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../model/book.entity';
import { BookDto } from '../model/book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async getAllBooks(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async getBookById(id: number): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id: id });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async createBook(bookDto: BookDto): Promise<Book> {
    const book = this.bookRepository.create(bookDto);
    return this.bookRepository.save(book);
  }

  async updateBook(id: number, bookDto: Partial<BookDto>): Promise<Book> {
    const book = await this.getBookById(id);
    Object.assign(book, bookDto);
    return this.bookRepository.save(book);
  }

  async deleteBook(id: number): Promise<void> {
    const book = await this.getBookById(id);
    await this.bookRepository.remove(book);
  }
}
