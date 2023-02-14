select FkTblUsuario FROM tblsesiones where Token = $token 
$FkUsuario 
select * from tblusuarios where PkTblUsuario = $FkUsuario
