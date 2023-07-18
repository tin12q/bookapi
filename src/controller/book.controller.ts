import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { Book } from '../model/book.entity';
import { BookDto } from '../model/book.dto';
import { BookService } from '../service/book.service';

@Controller('api/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getAllBooks(): Promise<Book[]> {
    return this.bookService.getAllBooks();
  }

  @Get(':id')
  async getBookById(@Param('id') id: number): Promise<Book> {
    return this.bookService.getBookById(id);
  }
  @Post()
  async createBook(
    @Body(new ValidationPipe()) bookDto: BookDto,
  ): Promise<Book> {
    return this.bookService.createBook(bookDto);
  }

  @Put(':id')
  async UpdateBook(
    @Param('id') id: number,
    @Body(new ValidationPipe()) bookDto: BookDto,
  ): Promise<Book> {
    return this.bookService.updateBook(id, bookDto);
  }

  @Delete(':id')
  async deleteBook(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.bookService.deleteBook(id);
  }
}
