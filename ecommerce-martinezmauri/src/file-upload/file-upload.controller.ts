import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../Auth/guards/AuthGuard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Role } from 'src/Auth/enum/roles.enum';
import { RoleGuard } from 'src/Auth/guards/RoleGuard';

@ApiTags('file')
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @ApiOperation({
    summary: 'Actualizar la imagen de un producto.',
    description:
      'Este endpoint permite actualizar la imagen de un producto mediante un archivo.',
  })
  @ApiBody({
    description:
      'Archivo de imagen a cargar debe ser de tipo jpg, jpeg, png o webp y debe tener un tamaño maximo de 200kb.Puede ser ejecutado unicamente por un administrador.',
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Producto con imagen actualizada y tiempo de expiracion de token.',
  })
  @ApiResponse({
    status: 404,
    description: 'No existe el producto al que quiere modificar',
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Roles(Role.Admin)
  @Post('uploadImage/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 204800,
            message: 'El archivo debe ser menor a 200kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileUpload = await this.fileUploadService.uploadProductImage(
      id,
      file,
    );
    return { fileUpload, exp: req.user.exp };
  }
}
