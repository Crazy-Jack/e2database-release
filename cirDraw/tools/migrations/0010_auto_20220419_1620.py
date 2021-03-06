# Generated by Django 3.2.5 on 2022-04-19 16:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tools', '0009_searchtablechipseq_score'),
    ]

    operations = [
        migrations.CreateModel(
            name='SearchTableMetaData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Gene', models.CharField(db_column='Gene', default='', max_length=255)),
                ('bin', models.IntegerField(db_column='bin', null=True)),
                ('count_data', models.IntegerField(db_column='count_data', null=True)),
            ],
            options={
                'db_table': 'MetaPercentData',
            },
        ),
        migrations.CreateModel(
            name='SearchTableMicroarray',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Log2FC', models.FloatField(db_column='Log2FC', null=True)),
                ('p_value', models.FloatField(db_column='pvalue', null=True)),
                ('padj', models.FloatField(db_column='padj', null=True)),
                ('minus_log10padj', models.FloatField(db_column='minus_log10padj', null=True)),
                ('GeneName', models.CharField(db_column='GeneName', max_length=255)),
                ('CellLine', models.CharField(db_column='CellLine', default='', max_length=255)),
                ('Dose', models.IntegerField(db_column='Dose', default='')),
                ('Rep', models.IntegerField(db_column='Rep', default='')),
                ('Duration', models.FloatField(db_column='Duration', null=True)),
                ('GSE', models.CharField(db_column='GSE', default='', max_length=255)),
                ('Source', models.CharField(db_column='Source', default='', max_length=255)),
            ],
            options={
                'db_table': 'MicroarrayData',
            },
        ),
        migrations.DeleteModel(
            name='SearchTable',
        ),
        migrations.DeleteModel(
            name='StatisticTable',
        ),
        migrations.DeleteModel(
            name='UploadParametersMD5',
        ),
        migrations.DeleteModel(
            name='UserDensity',
        ),
        migrations.DeleteModel(
            name='UserTable',
        ),
        migrations.DeleteModel(
            name='chromosome_length',
        ),
        migrations.DeleteModel(
            name='circ_disease',
        ),
        migrations.RemoveField(
            model_name='danrer11_species_circrnas',
            name='species_circrnas_ptr',
        ),
        migrations.RemoveField(
            model_name='danrer11_species_genome_exons_introns',
            name='species_genome_exons_introns_ptr',
        ),
        migrations.RemoveField(
            model_name='danrer11_species_genome_genes',
            name='species_genome_genes_ptr',
        ),
        migrations.RemoveField(
            model_name='danrer11_species_genome_transcripts',
            name='species_genome_transcripts_ptr',
        ),
        migrations.RemoveField(
            model_name='hg19_species_circrnas',
            name='species_circrnas_ptr',
        ),
        migrations.RemoveField(
            model_name='hg19_species_genome_exons_introns',
            name='species_genome_exons_introns_ptr',
        ),
        migrations.RemoveField(
            model_name='hg19_species_genome_genes',
            name='species_genome_genes_ptr',
        ),
        migrations.RemoveField(
            model_name='hg19_species_genome_transcripts',
            name='species_genome_transcripts_ptr',
        ),
        migrations.RemoveField(
            model_name='hg38_species_circrnas',
            name='species_circrnas_ptr',
        ),
        migrations.RemoveField(
            model_name='hg38_species_genome_exons_introns',
            name='species_genome_exons_introns_ptr',
        ),
        migrations.RemoveField(
            model_name='hg38_species_genome_genes',
            name='species_genome_genes_ptr',
        ),
        migrations.RemoveField(
            model_name='hg38_species_genome_transcripts',
            name='species_genome_transcripts_ptr',
        ),
        migrations.RemoveField(
            model_name='mm10_species_circrnas',
            name='species_circrnas_ptr',
        ),
        migrations.RemoveField(
            model_name='mm10_species_genome_exons_introns',
            name='species_genome_exons_introns_ptr',
        ),
        migrations.RemoveField(
            model_name='mm10_species_genome_genes',
            name='species_genome_genes_ptr',
        ),
        migrations.RemoveField(
            model_name='mm10_species_genome_transcripts',
            name='species_genome_transcripts_ptr',
        ),
        migrations.RemoveField(
            model_name='rn6_species_circrnas',
            name='species_circrnas_ptr',
        ),
        migrations.RemoveField(
            model_name='rn6_species_genome_exons_introns',
            name='species_genome_exons_introns_ptr',
        ),
        migrations.RemoveField(
            model_name='rn6_species_genome_genes',
            name='species_genome_genes_ptr',
        ),
        migrations.RemoveField(
            model_name='rn6_species_genome_transcripts',
            name='species_genome_transcripts_ptr',
        ),
        migrations.RemoveField(
            model_name='saccer3_species_circrnas',
            name='species_circrnas_ptr',
        ),
        migrations.RemoveField(
            model_name='saccer3_species_genome_exons_introns',
            name='species_genome_exons_introns_ptr',
        ),
        migrations.RemoveField(
            model_name='saccer3_species_genome_genes',
            name='species_genome_genes_ptr',
        ),
        migrations.RemoveField(
            model_name='saccer3_species_genome_transcripts',
            name='species_genome_transcripts_ptr',
        ),
        migrations.RemoveField(
            model_name='searchtablernaseq',
            name='ensembl',
        ),
        migrations.RemoveField(
            model_name='searchtablernaseq',
            name='entrezgene_id',
        ),
        migrations.AddField(
            model_name='searchtablechipseq',
            name='Source',
            field=models.CharField(db_column='Source', default='', max_length=255),
        ),
        migrations.AddField(
            model_name='searchtablernaseq',
            name='Source',
            field=models.CharField(db_column='Source', default='', max_length=255),
        ),
        migrations.AlterField(
            model_name='searchtablechipseq',
            name='chr_num',
            field=models.CharField(db_column='chr_num', default='', max_length=255),
        ),
        migrations.DeleteModel(
            name='species_circRNAs',
        ),
        migrations.DeleteModel(
            name='species_genome_exons_introns',
        ),
        migrations.DeleteModel(
            name='species_genome_genes',
        ),
        migrations.DeleteModel(
            name='species_genome_transcripts',
        ),
        migrations.DeleteModel(
            name='danRer11_species_circRNAs',
        ),
        migrations.DeleteModel(
            name='danRer11_species_genome_exons_introns',
        ),
        migrations.DeleteModel(
            name='danRer11_species_genome_genes',
        ),
        migrations.DeleteModel(
            name='danRer11_species_genome_transcripts',
        ),
        migrations.DeleteModel(
            name='hg19_species_circRNAs',
        ),
        migrations.DeleteModel(
            name='hg19_species_genome_exons_introns',
        ),
        migrations.DeleteModel(
            name='hg19_species_genome_genes',
        ),
        migrations.DeleteModel(
            name='hg19_species_genome_transcripts',
        ),
        migrations.DeleteModel(
            name='hg38_species_circRNAs',
        ),
        migrations.DeleteModel(
            name='hg38_species_genome_exons_introns',
        ),
        migrations.DeleteModel(
            name='hg38_species_genome_genes',
        ),
        migrations.DeleteModel(
            name='hg38_species_genome_transcripts',
        ),
        migrations.DeleteModel(
            name='mm10_species_circRNAs',
        ),
        migrations.DeleteModel(
            name='mm10_species_genome_exons_introns',
        ),
        migrations.DeleteModel(
            name='mm10_species_genome_genes',
        ),
        migrations.DeleteModel(
            name='mm10_species_genome_transcripts',
        ),
        migrations.DeleteModel(
            name='rn6_species_circRNAs',
        ),
        migrations.DeleteModel(
            name='rn6_species_genome_exons_introns',
        ),
        migrations.DeleteModel(
            name='rn6_species_genome_genes',
        ),
        migrations.DeleteModel(
            name='rn6_species_genome_transcripts',
        ),
        migrations.DeleteModel(
            name='sacCer3_species_circRNAs',
        ),
        migrations.DeleteModel(
            name='sacCer3_species_genome_exons_introns',
        ),
        migrations.DeleteModel(
            name='sacCer3_species_genome_genes',
        ),
        migrations.DeleteModel(
            name='sacCer3_species_genome_transcripts',
        ),
    ]
